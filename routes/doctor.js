let express = require('express');
let db = require('../database');
const path = require('path');
let router = express.Router();

router.post('/login', (req,res)=>{
    let {email, password} = req.body;
    db.find(email, password, 'doctors').then((result)=>{
        //res.end(result.id+": Doctor login successfull");
        res.render(path.join(__dirname, '../public/doctor.pug'), {doctorData:result});
    }).catch((message)=>{
        res.end(message);
    });
});
router.get('/requestsList/:id', (req, res)=>{
    let query = `SELECT ar.*, u.firstname, u.gender, u.address FROM appointmentrequests ar, users u WHERE ar.doctor_id=${req.params.id} AND user_id=u.id AND ar.status='pending';`
    db.query(query).then((result)=>{
        res.json(result);
    }).catch((message)=>{
        console.log(message);
        res.sendStatus(500); return;
    })
});
router.get('/completedList/:id', (req, res)=>{
    let query = `SELECT ar.*, u.firstname, u.gender, u.address FROM appointmentrequests ar, users u WHERE ar.doctor_id=${req.params.id} AND user_id=u.id AND ar.status='completed';`
    db.query(query).then((result)=>{
        res.json(result);
    }).catch((message)=>{
        console.log(message);
        res.sendStatus(500); return;
    })
});
router.get('/acceptedList/:id', (req, res)=>{
    let query = `SELECT ar.*, u.firstname, u.gender, u.address FROM appointmentrequests ar, users u WHERE ar.doctor_id=${req.params.id} AND user_id=u.id AND ar.status='accepted';`
    db.query(query).then((result)=>{
        console.log(result);
        res.json(result);
    }).catch((message)=>{
        console.log(message)
        res.sendStatus(500); return;
    })
});
router.post('/acceptedList', (req, res)=>{
    let {request_id, doctor_id} =  req.body;
    let query = `UPDATE appointmentrequests SET status='accepted' WHERE id=${request_id};`;
    db.query(query).then((result)=>{
        res.send('Record saved successfully');
    })
    .catch((message)=>{
        res.send('error while accepting request');
    });
});
router.post('/rejectList', (req, res)=>{
    let {request_id, doctor_id} =  req.body;
    let query = `UPDATE appointmentrequests SET status='rejected' WHERE id=${request_id};`;
    db.query(query).then((result)=>{
        res.send('Record saved successfully');
    })
    .catch((message)=>{
        res.send('error while accepting request');
    });
});
router.post('/completeList', (req, res)=>{
    let {request_id, prescription} =  req.body;
    let query = `UPDATE appointmentrequests SET status='completed', prescription='${prescription}' WHERE id=${request_id};`;
    db.query(query).then((result)=>{
        res.send('Record saved successfully');
    })
    .catch((message)=>{
        res.send('error while accepting request');
    });
});
router.post('/updateAccount', (req, res)=>{
    let {FirstName, LastName, Email, Password, Department, Age, Gender, Address, StartTime, EndTime, WeekDays, id} = req.body;
    let query = `UPDATE doctors SET firstName='${FirstName}', lastName='${LastName}', email='${Email}', password='${Password}', Department='${Department}',age=${Age}, gender='${Gender}', address='${Address}', startTime='${StartTime}', endTime='${EndTime}', weekDays='${WeekDays}' WHERE id=${id};`;
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
module.exports = router;