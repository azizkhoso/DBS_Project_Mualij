var requests;
var accepted;
$('document').ready(function(){
    console.log('Document loaded successfully');
    showMenu('appointments');
    loadRequestsList();
});
function showMenu(id){
    console.log('showing '+id);
    let menus = ['appointments', 'history', 'accountSettings'];
    menus.forEach(function(element){
      if(element===id) {
          console.log(element, id);
        $('#'+element).show();
      }
      else {
        $('#'+element).hide();
      }
      if(element==='appointments') loadRequestsList();
      if(element==='history') loadCompletedList();
    });
  }
function loadRequestsList(){
    $.ajax({method:'GET', url:'acceptedList/'+ $('body').attr('id')}).then((result)=>{
        accepted = Object.assign(result);
        tbody = $('#acceptedList tbody');
        if($('#acceptedList tbody tr').length<=0){
          accepted.forEach((element, key) => {
            let {id, user_id, doctor_id, day, time, firstname, gender, address, date} = element;
            let requestRecord = '<tr id='+id+'>' + 
                                '<td>'+(key+1)+'</td>'+
                                '<td>'+firstname + '</td>'+
                                '<td>'+Time.parse(time).toString12()+ '</td>'+
                                '<td>'+day+ '</td>'+
                                '<td>'+date.substr(0, 10)+'</td>'+
                                '<td>'+gender+'</td>'+
                                '<td>'+address+'</td>'+
                                '<td>'+'<button onclick="completeRequest('+id+')">Complete</button>'+
                                '</tr>';
            console.log("Accept req: "+requestRecord);
            tbody.append(requestRecord);
          })
        }
    }).catch((message)=>{
      console.log(message);
    });
    //--------------------------------------
    $.ajax({method:'GET', url:'requestsList/'+$('body').attr('id')}).then((result)=>{
            requests = Object.assign(result);
            tbody = $('#requestsList tbody');
            if($('#newAppt tbody tr').length<=0)
              requests.forEach((element, key) => {
                let {id, user_id, doctor_id, day, time, firstname, gender, address, date} = element;
                let requestRecord = '<tr id='+id+'>' + 
                                    '<td>'+(key+1)+'</td>'+
                                    '<td>'+firstname + '</td>'+
                                    '<td>'+Time.parse(time).toString12()+ '</td>'+
                                    '<td>'+day+ '</td>'+
                                    '<td>'+date.substr(0, 10)+'</td>'+
                                    '<td>'+gender+'</td>'+
                                    '<td>'+address+'</td>'+
                                    '<td>'+'<button onclick="acceptRequest('+id+')">Accept</button>'+'/'+'<button onclick="rejectRequest('+id+')">Reject</button>'+
                                    '</tr>';
                console.log(requestRecord);
                tbody.append("plain req: "+requestRecord);
              });
    }).catch((message)=>{
        console.log('error while loading: '+message);
    });
    //-------------------------------------------------
    
};

function loadCompletedList(){
  $.ajax({method:'GET', url:'completedList/'+ $('body').attr('id')}).then((result)=>{
    tbody = $('#completedList tbody');
    if($('#completedList tbody tr').length<=0){
      result.forEach((element, key) => {
        let {id, day, time, firstname, gender, address, status, prescription, date} = element;
        let requestRecord = '<tr id='+id+'>' + 
                            '<td>'+(key+1)+'</td>'+
                            '<td>'+firstname + '</td>'+
                            '<td>'+Time.parse(time).toString12()+ '</td>'+
                            '<td>'+day+ '</td>'+
                            '<td>'+date.substr(0, 10)+'</td>'+
                            '<td>'+gender+'</td>'+
                            '<td>'+address+'</td>'+
                            '<td>'+status.toUpperCase()+
                            '<td>'+prescription+'</td>'+
                            '</tr>';
        tbody.append(requestRecord);
      });
    }
}).catch((message)=>{
  console.log(message);
});

}

function acceptRequest(id){
  $.ajax({url: '/doctor/acceptedList', method:'POST', data:{request_id: id, doctor_id: $('body').attr('id')}})
  .then((result)=>{
    $('#newAppt div#appointmentActionMessage span#successMessage').html('Request Accepted Successfully');
  })
  .catch((message)=>{
    $('#newAppt div#appointmentActionMessage span#errorMessage').html('Error occured while accepting request: '+message);
  });
}

function rejectRequest(id){
  $.ajax({url: '/doctor/rejectList', method:'POST', data:{request_id: id, doctor_id: $('body').attr('id')}})
  .then((result)=>{
    $('#newAppt div#appointmentActionMessage span#successMessage').html('Request Rejected Successfully');
  })
  .catch((message)=>{
    $('#newAppt div#appointmentActionMessage span#errorMessage').html('Error occured while rejecting request: '+message);
  });
}

function completeRequest(id){
  let prescription = prompt('Please Enter prescrition');
  $.ajax({url: '/doctor/completeList', method:'POST', data:{request_id: id, doctor_id: $('body').attr('id'), prescription: prescription}})
  .then((result)=>{
    $('#acceptedAppt div#completemessage span#successMessage').html('Request Completed Successfully');
  })
  .catch((message)=>{
    $('#acceptedAppt div#completemessage span#errorMessage').html('Error occured while completing request: '+message);
  });
}

async function updateAccount(){
  let FirstName = document.querySelector('#firstName').value;
  let LastName = document.querySelector('#lastName').value;
  let Email = document.querySelector('#email').value;
  let Password = document.querySelector('#password').value;
  let Age = document.querySelector('#Age').value;
  let Gender = document.querySelector('#Gender').value;
  let Address = document.querySelector('#Address').value;
  let Department = document.querySelector('#Department').value;
  let StartTime = document.querySelector('#StartTime').value;
  let EndTime = document.querySelector('#ET').value;
  let WeekDays = document.querySelector('#WeekDays').value.toUpperCase().trim();
  let id = $('body').attr('id');
  let correctWeekDaysFormat = true;
  let res = await WeekDays.split(',').forEach((day)=>{
    if(day.length!==3) {
      correctWeekDaysFormat = false;
      return;
    }
  });
  if(correctWeekDaysFormat)
    $.ajax({url:'/doctor/updateAccount/', method:'POST', data:{FirstName, LastName, Email, Password, Department, Age, Gender, Address, StartTime, EndTime, WeekDays, id}})
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
  else {
    document.querySelector('#updateAccountError').innerHTML = 'Please input days in valide format...';
    document.querySelector('#updateAccountSuccess').innerHTML = '';
  }
}