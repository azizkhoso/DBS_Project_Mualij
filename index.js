const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const doctor = require('./routes/doctor');
const user = require('./routes/user');
const Time = require('./Time');
let db = require('./database');

let app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '/public')));
app.use('/doctor', doctor); //Doctor routes
app.use('/doctor',express.static(path.join(__dirname, '/public')));
app.use('/user', user); //User routes
app.use('/user',express.static(path.join(__dirname, '/public')));

app.get('/doctor/register', (req, res)=>{
    res.render(path.join(__dirname, '/public/doctorRegisteration.pug'));
});
app.get('/user/register', (req, res)=>{
    res.sendFile(path.join(__dirname, '/public/userRegisteration.html'));
});
app.post('/userRegisteration', function(req, res){
    let {firstName, lastName, email, password, confirmPassword, age, gender, address} = req.body;
    if(password!==confirmPassword) res.sendFile(path.join(__dirname, '/public/registerationFailed.html'));
    let sql = `INSERT INTO users(firstname, lastname, email, password, age, gender, address) VALUES('${firstName}', '${lastName}', '${email}', '${password}', ${age}, '${gender}', '${address}')`;
    console.log('Executing: '+sql);
    db.query(sql).then((result)=>{
        res.sendFile(path.join(__dirname, '/public/registerationSuccessful.html'));
    }).catch((message)=>{
        res.sendFile(path.join(__dirname, '/public/registerationFailed.html'));
        console.log(message);
    });
});
app.post('/doctorRegisteration', function(req, res){
    console.log(req.body);
    let {firstName, lastName, email, password, confirmPassword, department, age, gender, address, startTime, endTime} = req.body;
    if(password!==confirmPassword) {res.render(path.join(__dirname, '/public/doctorRegisteration.pug'), {errorMessage: "Password and confirm password don't match"}); return;}
    if(!isAvailabilityCorrect(req.body)) {res.render(path.join(__dirname, '/public/doctorRegisteration.pug'), {errorMessage: "StartTime is greater than EndTime or No week days selected"}); return;}
    let availableDays = getWeekDaysString(req.body);
    let sql = `INSERT INTO doctors(firstname, lastname, email, password, department, age, gender, address, startTime, endTime, WeekDays) 
                VALUES('${firstName}', '${lastName}', '${email}', '${password}', '${department}', ${age}, '${gender}', '${address}', '${startTime}', '${endTime}', '${availableDays}')`;
    console.log('Executing: '+sql);
    db.query(sql).then((result)=>{
        res.render(path.join(__dirname, '/public/doctorRegisteration.pug'), {successMessage: 'Registeration Successful'});
    }).catch((message)=>{
        res.render(path.join(__dirname, '/public/doctorRegisteration.pug'), {errorMessage: "Error while saving info, email already exists or some field is left empty"});
    });
});

app.listen(3000, (err)=>{
    if(err) console.log('Error occured in app.listen');
    console.log('Listening on port 3000');
});

function isAvailabilityCorrect(obj){
    let {startTime, endTime}  = obj;
    let st = Time.parse(startTime);
    let et = Time.parse(endTime);
    let {MON='off', TUE='off', WED='off', THU='off', FRI='off', SAT='off', SUN='off'} = obj;
    let daysObj = {MON, TUE, WED, THU, FRI, SAT, SUN};
    if(st.compare(et)>0) return false;
    if(getWeekDaysString(daysObj)=="") return false;
    return true;
}
function getWeekDaysString(obj){
    let str = '';
    for(const p in obj){
        if(obj[p]=='on') str+= (p+'').toUpperCase()+',';
    }
    return str.substr(0, str.length-1);
}


app.post('/test', (req, res)=>{
    console.log(req.body);
})