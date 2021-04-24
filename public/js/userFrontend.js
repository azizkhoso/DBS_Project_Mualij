var doctors;
$('document').ready(function(){

});
function loadDoctorsList(){
    $.ajax({method:'GET', url:'doctorsList'}).then((result)=>{
        doctors = Object.assign(result);
        tbody = $('#doctorsList tbody');
        if($('#newAppt tbody tr').length<=0)
        result.forEach((doctor, key)=>{
            let {id, FirstName, Department, Age, Gender, Address, StartTime, EndTime, WeekDays} = doctor;
            let Availability = Time.parse(StartTime).toString12()+" - "+Time.parse(EndTime).toString12();
            let doctorRecord =  '<tr id='+id+' onclick=viewDoctor('+key+')>'+
                                '<td>'+(key+1)+'</td>'+                                
                                '<td>'+FirstName+'</td>'+
                                '<td>'+Availability+'</td>'+
                                '<td>'+Department+'</td>'+
                                '<td>'+Age+'</td>'+
                                '<td>'+Gender+'</td>'+
                                '</tr>';
            tbody.append(doctorRecord);
        });
    }).catch((message)=>{
        console.log('message: '+message);
    });
    //-------------------------------------
    $.ajax({method:'GET', url:'pendingAcceptedList/'+$('body').attr('id')}).then((result)=>{
        //doctors = Object.assign(result);
        tbody = $('#pendingAcceptedList tbody');
        if($('#pendingAcceptedList tbody tr').length<=0)
        result.forEach((request, key)=>{
            let {id, firstname, time, day, department, gender, address, status, date} = request;
            console.log(Object.toString(request));
            let requestRecord =  '<tr id='+id+'>'+
                                '<td>'+(key+1)+'</td>'+                                
                                '<td>'+firstname+'</td>'+
                                '<td>'+time+'</td>'+
                                '<td>'+day+'</td>'+
                                '<td>'+date.substr(0, 10)+'</td>'+
                                '<td>'+department+'</td>'+
                                '<td>'+gender+'</td>'+
                                '<td>'+address+'</td>'+
                                '<td>'+status.toUpperCase()+'</td>'+
                                '</tr>';
            tbody.append(requestRecord);
        });
    }).catch((message)=>{
        console.log('message: '+message);
    });
    //------------------------------------
    $.ajax({method:'GET', url:'rejectedList/'+$('body').attr('id')}).then((result)=>{
        //doctors = Object.assign(result);
        tbody = $('#rejectedList tbody');
        if($('#rejectedList tbody tr').length<=0)
        result.forEach((request, key)=>{
            let {id, firstname, time, day, department, gender, address, status, date} = request;
            console.log(Object.toString(request));
            let requestRecord =  '<tr id='+id+'>'+
                                '<td>'+(key+1)+'</td>'+                                
                                '<td>'+firstname+'</td>'+
                                '<td>'+time+'</td>'+
                                '<td>'+day+'</td>'+
                                '<td>'+date.substr(0, 10)+'</td>'+
                                '<td>'+department+'</td>'+
                                '<td>'+gender+'</td>'+
                                '<td>'+address+'</td>'+
                                '<td>'+status.toUpperCase()+'</td>'+
                                '</tr>';
            tbody.append(requestRecord);
        });
    }).catch((message)=>{
        console.log('message: '+message);
    });
}

function requestAppointment(id, d, t){
    //location.reload();
    //showMenu('appointments');
    if(!t) {$('#errorMessage').html('Please set time....'); return;};
    $.ajax({method:'POST', url:'requestAppointment/'+id+'/'+$('body').attr('id'), data:{ time: t, date:d}}).then((result)=>{
        console.log(result);
        $('#successMessage').html('Appointment request sent Successfully...');
    }).catch((message)=>{
        console.log(message);
        $('#errorMessage').html('Please set Valid time and day on which doctor is available');
    });
}

function loadCompletedList(){
    $.ajax({method:'GET', url:'completedList/'+$('body').attr('id')}).then((result)=>{
        //doctors = Object.assign(result);
        tbody = $('#completedList tbody');
        if($('#completedList tbody tr').length<=0)
        result.forEach((request, key)=>{
            let {id, firstname, time, day, department, gender, address, status, prescription, date} = request;
            console.log(Object.toString(request));
            let requestRecord =  '<tr id='+id+'>'+
                                '<td>'+(key+1)+'</td>'+                                
                                '<td>'+firstname+'</td>'+
                                '<td>'+time+'</td>'+
                                '<td>'+day+'</td>'+
                                '<td>'+date.substr(0, 10)+'</td>'+
                                '<td>'+department+'</td>'+
                                '<td>'+gender+'</td>'+
                                '<td>'+address+'</td>'+
                                '<td>'+status.toUpperCase()+'</td>'+
                                '<td>'+prescription+'</td>'+
                                '</tr>';
            tbody.append(requestRecord);
        });
    }).catch((message)=>{
        console.log('message: '+message);
    });
}

function viewDoctor(key){
    console.log('Doctor key: '+key+" details: "+doctors[key]);
    let {id, FirstName, Department, Age, Gender, Address, StartTime, EndTime, WeekDays} = doctors[key];
    let time = Time.parse(StartTime).toString12()+" - "+Time.parse(EndTime).toString12();
    $('#doctorDetails').show();
    $('#doctorDetails').attr('id', id);
    $('#doctorName').html(FirstName);
    $('#availability').html('Time: '+time);
    $('#weekDays').html('Days: '+WeekDays);
    $('#department').html('Department: '+Department);
    $('#age').html('Age: '+Age);
    $('#gender').html('Gender: '+Gender);
    $('#ratings').html('Ratings: *****');
    $('#address').html('Address: '+Address);
    $('#sendRequest').click(function(){
        let t = document.querySelector('#time').value;
        let d = document.querySelector('#date').value;
        requestAppointment(id, d, t);
    });
}

function updateAccount(){
    let FirstName = document.querySelector('#firstName').value;
    let LastName = document.querySelector('#lastName').value;
    let Email = document.querySelector('#email').value;
    let Password = document.querySelector('#password').value;
    let Age = document.querySelector('#Age').value;
    let Gender = document.querySelector('#Gender').value;
    let Address = document.querySelector('#Address').value;
    let id = $('body').attr('id');
    $.ajax({url:'/user/updateAccount/', method:'POST', data:{FirstName, LastName, Email, Password, Age, Gender, Address, id}})
    .then((result)=>{
        console.log('UpdateAccount: ',result);
        document.querySelector('#updateAccountSuccess').innerHTML = 'Account details updated successfully';
        document.querySelector('#updateAccountError').innerHTML = '';
    })
    .catch((message)=>{
        console.log('UpdateAccountError: ', message);
        document.querySelector('#updateAccountError').innerHTML = 'Please input days in valide format...';
        document.querySelector('#updateAccountSuccess').innerHTML = '';
    });
}