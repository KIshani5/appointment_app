// endpoint
const API='http://localhost:3000/api';

// alert mesasage
function showAlert(containerId,message,type='danger'){
  document.getElementById(containerId).innerHTML=`
    <div class="alert alert-${type} py-2">${message}</div>`;
}

// login
async function handleLogin(){
  const email=document.getElementById('email').value.trim();
  const password=document.getElementById('password').value;

  if(!email||!password){
    return showAlert('alert-box', 'Please fill in all fields.');
  }

  try{
    // login request send
    const res=await fetch(`${API}/auth/login`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email,password}),
    });

    const data=await res.json();

    if(!res.ok) 
      return showAlert('alert-box',data.message);

    localStorage.setItem('token',data.token);
    localStorage.setItem('user',JSON.stringify(data.user));

    // redirect
    window.location.href=data.user.role==='admin'?'admin.html':'dashboard.html';

  }catch{
    showAlert('alert-box','Cannot connect to server.');
  }
}

// user registration
async function handleRegister(){
  const name=document.getElementById('name').value.trim();
  const email=document.getElementById('email').value.trim();
  const password=document.getElementById('password').value;

  if(!name||!email||!password){
    return showAlert('alert-box','All fields are required.');
  }

  try{
    // register request 
    const res=await fetch(`${API}/auth/register`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name,email,password}),
    });

    const data=await res.json();

    if(!res.ok) 
      return showAlert('alert-box',data.message);

    showAlert('alert-box','Registered! Redirecting...','success');
    // login redirect
    setTimeout(()=>(window.location.href='index.html'),1500);
  }catch{
    showAlert('alert-box','Cannot connect to server.');
  }
}

// logout
function logout(){
  localStorage.clear();
  window.location.href='index.html';
}