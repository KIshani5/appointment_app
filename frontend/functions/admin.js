// endpoint
const API='http://localhost:3000/api';
// jwt token after login
const token=localStorage.getItem('token');
const user=JSON.parse(localStorage.getItem('user')||'{}');

if(!token||user.role!=='admin')
  window.location.href='index.html';

function authHeaders(){
  return {'Content-Type':'application/json',Authorization:`Bearer ${token}`};
}

// status colour badge
function statusBadge(status){
  const colors={pending:'warning',approved:'success',rejected:'danger'};
  return `<span class="badge bg-${colors[status]||'secondary'}">${status}</span>`;
}

// ---- SERVICES ----
// get all services
async function loadServices(){
  const res=await fetch(`${API}/services`);
  const services=await res.json();
  // TABLE
  const tbody=document.getElementById('services-table');

  tbody.innerHTML=services.map(s => `
    <tr>
      <td>
        <input class="form-control form-control-sm" value="${s.service_name}" id="sname-${s.id}" oninput="enableServiceSave(${s.id})" />
      </td>
      <td>
        <input class="form-control form-control-sm" value="${s.description || ''}" id="sdesc-${s.id}" oninput="enableServiceSave(${s.id})" />
      </td>
      <td>
        <input class="form-control form-control-sm" type="number" value="${s.duration_minutes}" id="sdur-${s.id}" style="width:80px" oninput="enableServiceSave(${s.id})" />
      </td>
      <td>
        <button class="btn btn-sm btn-primary me-1" id="save-svc-btn-${s.id}" onclick="updateService(${s.id})" disabled>Save</button>
        <button class="btn btn-sm btn-danger" onclick="deleteService(${s.id})">Delete</button>
      </td>
    </tr>`).join('');
}

// save button services
function enableServiceSave(id){
  document.getElementById(`save-svc-btn-${id}`).disabled=false;
}

// save button appointments
function enableSave(id){
  document.getElementById(`save-btn-${id}`).disabled=false;
}

// create service
async function createService(){

  // form values
  const name=document.getElementById('svc-name').value.trim();
  const description=document.getElementById('svc-desc').value.trim();
  const duration_minutes=document.getElementById('svc-duration').value;

  if (!name) 
    return alert('Service name is required');

  // POST REQUEST TO BACKEND
  await fetch(`${API}/services`,{
    method:'POST',
    headers:authHeaders(),
    body:JSON.stringify({ name,description,duration_minutes}),
  });

  document.getElementById('svc-name').value='';
  document.getElementById('svc-desc').value='';
  loadServices();
}

// update service
async function updateService(id){
  // get updated vaolues
  const name=document.getElementById(`sname-${id}`).value;
  const description=document.getElementById(`sdesc-${id}`).value;
  const duration_minutes=document.getElementById(`sdur-${id}`).value;

  // PUT REQUEST TO UPDATE
  await fetch(`${API}/services/${id}`,{
    method:'PUT',
    headers:authHeaders(),
    body:JSON.stringify({name,description,duration_minutes}),
  });

  loadServices();
}

// delete service
async function deleteService(id){
  if(!confirm('Delete this service?')) 
    return;

  // DELETE REQUEST
  await fetch(`${API}/services/${id}`,{
    method:'DELETE',headers:authHeaders()
  });
  loadServices();
}

// APPOINTMENT
async function loadAllAppointments(){
  const res=await fetch(`${API}/appointments/all`,{headers:authHeaders()});
  const appointments=await res.json();
  const tbody=document.getElementById('all-appointments-table');

  if(!appointments.length){
    tbody.innerHTML=`<tr><td colspan="6" class="text-center text-muted">No appointments.</td></tr>`;
    return;
  }

  // show rows
  tbody.innerHTML=appointments.map(a=>`
    <tr>
      <td>${a.user_name}<br/><small class="text-muted">${a.user_email}</small></td>
      <td>${a.service_name}</td>
      <td>${a.appointment_date?.split('T')[0]}</td>
      <td>${a.appointment_time}</td>
      <td>${statusBadge(a.status)}</td>
      <td>
        <button class="btn btn-success btn-sm me-1" onclick="updateStatus(${a.id}, 'approved')">✓</button>
        <button class="btn btn-danger btn-sm" onclick="updateStatus(${a.id}, 'rejected')">✗</button>
      </td>
    </tr>`).join('');
}

// update appoitnemnt status
async function updateStatus(id, status){
  await fetch(`${API}/appointments/${id}/status`, {
    method:'PUT',
    headers:authHeaders(),
    body:JSON.stringify({status}),
  });

  loadAllAppointments();
}

// admin logout
function logout(){
  localStorage.clear();
  window.location.href='index.html';
}

// page laod
loadServices();
loadAllAppointments();