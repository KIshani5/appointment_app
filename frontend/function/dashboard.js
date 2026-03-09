// endpoint
const API='http://localhost:3000/api';
// jwt token after login
const token=localStorage.getItem('token');
const user=JSON.parse(localStorage.getItem('user')||'{}');

if(!token) 
  window.location.href='index.html';

document.getElementById('user-name').textContent=`${user.name}`;

function authHeaders(){
  return {
    'Content-Type':'application/json',
    // jwt tokem-authrentication
    Authorization:`Bearer ${token}`};
}

// status colour badge
function statusBadge(status){
  const colors={pending:'warning',approved:'success',rejected:'danger'};
  return `<span class="badge bg-${colors[status]||'secondary'}">${status}</span>`;
}

// get all services
async function loadServices(){
  const res=await fetch(`${API}/services`);
  const services=await res.json();

   //cache for edit dropdowns
  window.allServices=services
  const sel=document.getElementById('service-select');
  // dropdown services
  sel.innerHTML=services.map(s=>
    `<option value="${s.id}">${s.service_name} (${s.duration_minutes} min)</option>`).join('');
   await loadMyAppointments();
}
// user appointments
async function loadMyAppointments(){
  const res=await fetch(`${API}/appointments/my`,{headers:authHeaders()});
  const appointments=await res.json();
  const tbody=document.getElementById('appointments-table');

  if(!appointments.length){
    tbody.innerHTML=`<tr><td colspan="6" class="text-center text-muted">No appointments yet.</td></tr>`;
    return;
  }

  tbody.innerHTML=appointments.map(a=>{
    // const date=a.appointment_date?.split('T')[0];
    const date=new Date(a.appointment_date).toISOString().split('T')[0];

    const isPending=a.status=== 'pending';

    return `
      <tr id="row-${a.id}">
        <td>
          ${isPending
            ? `<select class="form-select form-select-sm" id="edit-svc-${a.id}" onchange="enableSave(${a.id})">${getServiceOptions(a.service_id)}</select>`
            : a.service_name}
        </td>
        <td>
          ${isPending
            ? `<input type="date" class="form-control form-control-sm" id="edit-date-${a.id}" value="${date}" onchange="enableSave(${a.id})" />`
            : date}
        </td>
        <td>
          ${isPending
            ? `<input type="time" class="form-control form-control-sm" id="edit-time-${a.id}" value="${a.appointment_time}" onchange="enableSave(${a.id})" />`
            : a.appointment_time}
        </td>
        <td>${statusBadge(a.status)}</td>
        <td>
          ${isPending
            ? `<input type="text" class="form-control form-control-sm" id="edit-notes-${a.id}" value="${a.notes || ''}" oninput="enableSave(${a.id})" />`
            : (a.notes || '—')}
        </td>
        <td>
          ${isPending ? `
            <button class="btn btn-sm btn-primary me-1" id="save-btn-${a.id}" onclick="saveAppointment(${a.id})" disabled> Update </button>
            <button class="btn btn-sm btn-danger" onclick="deleteAppointment(${a.id})">Cancel</button>
          ` : `<span class="text-muted small">Locked</span>`}
        </td>
      </tr>`;
      }).join('');
}

//list with current services
function getServiceOptions(selectedId){
  return window.allServices.map(s=>
    `<option value="${s.id}" ${s.id==selectedId?'selected':''}>${s.service_name}</option>`
  ).join('');
}

// savebutton
function enableSave(id){
  document.getElementById(`save-btn-${id}`).disabled=false;
}

// save appointment
async function saveAppointment(id){
  const service_id=document.getElementById(`edit-svc-${id}`).value;
  const appointment_date=document.getElementById(`edit-date-${id}`).value;
  const appointment_time=document.getElementById(`edit-time-${id}`).value;
  const notes=document.getElementById(`edit-notes-${id}`).value;

  const res=await fetch(`${API}/appointments/${id}`,{
    method:'PUT',
    headers:authHeaders(),
    body:JSON.stringify({service_id,appointment_date,appointment_time,notes}),
  });

  const data=await res.json();

  if(!res.ok){
    document.getElementById('form-alert').innerHTML=`<div class="alert alert-danger py-2">${data.message}</div>`;
    return;
  }

  document.getElementById('form-alert').innerHTML=`<div class="alert alert-success py-2">Appointment updated!</div>`;
  loadMyAppointments();
}

// new appointment
async function bookAppointment(){
  const service_id=document.getElementById('service-select').value;
  const appointment_date=document.getElementById('appt-date').value;
  const appointment_time=document.getElementById('appt-time').value;
  const notes=document.getElementById('appt-notes').value;

  if(!appointment_date||!appointment_time){
    document.getElementById('form-alert').innerHTML=`<div class="alert alert-danger py-2">Date and time are required.</div>`;
    // return;
    const selectedDateTime=new Date(`${appointment_date}T${appointment_time}`);
    if(selectedDateTime<=new Date()){
      document.getElementById('form-alert').innerHTML=`<div class="alert alert-danger py-2">Appointment must be in the future.</div>`;
      return;
    }
  }

  // POST appointment
  const res=await fetch(`${API}/appointments`,{
    method:'POST',
    headers:authHeaders(),
    body:JSON.stringify({service_id,appointment_date,appointment_time,notes}),
  });

  const data=await res.json();

  if(!res.ok){
    document.getElementById('form-alert').innerHTML=`<div class="alert alert-danger py-2">${data.message}</div>`;
    return;
  }

  document.getElementById('form-alert').innerHTML=`<div class="alert alert-success py-2">Appointment booked!</div>`;
  loadMyAppointments();
}

// delete appointment
async function deleteAppointment(id){
  if(!confirm('Cancel this appointment?')) 
    return;

  await fetch(`${API}/appointments/${id}`,{
    method:'DELETE',
    headers:authHeaders(),
  });

  loadMyAppointments();
}

// logout user
function logout(){
  localStorage.clear();
  window.location.href='index.html';
}

// init
loadServices();
// loadMyAppointments();