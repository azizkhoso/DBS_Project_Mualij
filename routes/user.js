let express = require('express');
let db = require('../database');
const path = require('path');
const { read } = require('fs');
const Time = require('../Time');
let router = express.Router();


router.post('/login', (req, res)=>{
    let {email, password}  = req.body;
    db.find(email, password, 'users').then((result)=>{
        console.log(result);
        res.render(path.join(__dirname, '../public/user.pug'), {userData:result});
    }).catch((message)=>{
        res.end(message);
    });
});
router.get('/doctorsList', (req, res)=>{
    db.query('SELECT id, FirstName, Email, Department, Age, Gender, Address, StartTime, EndTime, WeekDays FROM doctors;').then((result)=>{
        res.json(result);
        console.log(result);
    }).catch((message)=>{
        res.end(message);
    });
});
router.post('/requestAppointment/:doctorId/:userId', (req, res)=>{
    //console.log('Doctor id: ' + req.params.id);
    //res.send('Doctor id: ' + req.params.doctorId+ ' User id: ' + req.params.userId+' - '+req.body.day + '- '+req.body.time);
    let doctor_id = req.params.doctorId; let user_id = req.params.userId;
    //let day = req.body.day; 
    let date = new Date(Date.parse(req.body.date));
    let day = numberToDay(date.getDay());
    let time = req.body.time;
    //Checking validity
    db.query('SELECT starttime, endtime, weekdays from doctors where id='+doctor_id+';').then((result)=>{
        let {starttime, endtime} = result[0];
        let st = Time.parse(starttime);
        let et = Time.parse(endtime);
        let t = Time.parse(time);
        if(!(t.compare(st)>=0 && t.compare(et)<0)) {res.sendStatus(500); return;}
        if(!result[0].weekdays.toUpperCase().includes(day.toUpperCase())){
            console.log('day not in week days');
            {res.sendStatus(500); return;}
        }
        else{
            let query = `INSERT INTO appointmentrequests (doctor_id, user_id, time, day, date) VALUES (${doctor_id}, ${user_id}, '${time}', '${day}', '${req.body.date}');`
            db.query(query).then((result)=>{
                console.log(result);
                res.send(result);
            }).catch((message)=>{
                res.sendStatus(500);
                res.send(message);
            });
        }
    }).catch((message)=>{
        console.log(message);
        res.sendStatus(500);
        return;
    })
});
router.get('/pendingAcceptedList/:id', (req, res)=>{
    let query = `SELECT ar.id, d.firstname, ar.time, ar.day, d.department, d.gender, d.address, ar.status, ar.date FROM appointmentrequests ar, doctors d WHERE ar.user_id=${req.params.id} AND ar.doctor_id=d.id AND (status='accepted' or status='pending');`
    db.query(query).then((result)=>{
        res.json(result);
    }).catch((message)=>{
        res.sendStatus(500);
        res.end(message);
    });
});
router.get('/rejectedList/:id', (req, res)=>{
    let query = `SELECT ar.id, d.firstname, ar.time, ar.day, d.department, d.gender, d.address, ar.status, ar.date FROM appointmentrequests ar, doctors d WHERE ar.user_id=${req.params.id} AND ar.doctor_id=d.id AND status='rejected';`
    db.query(query).then((result)=>{
        res.json(result);
    }).catch((message)=>{
        res.sendStatus(500);
        res.end(message);
    });
});
router.get('/completedList/:id', (req, res)=>{
    let query = `SELECT ar.id, ar.prescription, d.firstname, ar.time, ar.day, ar.date, d.department, d.gender, d.address, ar.status FROM appointmentrequests ar, doctors d WHERE ar.user_id=${req.params.id} AND ar.doctor_id=d.id AND status='completed';`
    db.query(query).then((result)=>{
        res.json(result);
    }).catch((message)=>{
        res.sendStatus(500);
        res.end(message);
    });
});
router.post('/updateAccount', (req, res)=>{
    let {FirstName, LastName, Email, Password, Age, Gender, Address, id} = req.body;
    let query = `UPDATE users SET firstName='${FirstName}', lastName='${LastName}', email='${Email}', password='${Password}', age=${Age}, gender='${Gender}', address='${Address}' WHERE id=${id};`;
    db.query(query)
    .then((result)=>{
        //res.sendStatus(200);
        res.send('Record update succusseful');
        console.dir(result);
    })
    .catch((message)=>{
        res.sendStatus(500);
        res.end('Error occured while updating record');
        console.dir(message);
    });
});
function dayToNumber(day){
    switch(day.toUpperCase()){
        case 'MON': return 1;
        case 'TUE': return 2;
        case 'WED': return 3;
        case 'THU': return 4;
        case 'FRI': return 5;
        case 'SAT': return 6;
        case 'SUN': return 0;
    }
}
function numberToDay(number){
    switch(Number.parseInt(number)){
        case 1: return 'MON';
        case 2: return 'TUE';
        case 3: return 'WED';
        case 4: return 'THU';
        case 5: return 'FRI';
        case 6: return 'SAT';
        case 0: return 'SUN';
    }
}
function weekDaysToNumberArray(weekdays){
    let numberArray = weekdays.split(',').map((dayString)=>{
        return dayToNumber(dayString);
    });
    return numberArray;
}
function numberArrayToWeekDays(numArr){
    let weekDays = numArr.map((num)=>{
        return numberToDay(num);
    });
    return weekDays.join(',');
}
module.exports = router;