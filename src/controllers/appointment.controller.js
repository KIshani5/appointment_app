// postgresqll
const pool = require('../db');

// CREATE APPOINTMENT
const createAppointment= async (req,res)=>{
  // get appointment data
  const {service_id,appointment_date,appointment_time,notes}=req.body;
  const user_id=req.user.userId;

  if (!service_id||!appointment_date||!appointment_time){
    return res.status(400).json({message:'Service,date, and time are required'});
  }
  // date eobject
  const selectedDateTime=new Date(`${appointment_date}T${appointment_time}`);
  
  if (selectedDateTime<=new Date()) {
    return res.status(400).json({ message:'Appointment must be in the future'});
  }

  try{
    // INSERT to DB
    const result=await pool.query(
      `insert into appointments (user_id,service_id,appointment_date,appointment_time,notes)
       values ($1,$2,$3,$4,$5) returning *`,
      [user_id,service_id,appointment_date,appointment_time,notes]
    );
    res.status(201).json(result.rows[0]);

  } catch (err){
    res.status(500).json({message:'Server errror', error:err.message });
  }
};

// USERS APPINTMENTS
const getMyAppointments=async(req, res)=>{
  // user id 
  const user_id= req.user.userId;

  try{
    // users appointment llsit
    const result=await pool.query(
      `select a.*, s.service_name as service_name, s.duration_minutes
       from appointments a
       join services s on a.service_id = s.id
       where a.user_id = $1
       order by a.appointment_date DESC, a.appointment_time desc`,
      [user_id]
    );
    res.json(result.rows);
  }catch(err){
    res.status(500).json({message:'Server error',error:err.message});
  }
};

// ALL DOCUMENTS
const getAllAppointments=async(req,res) =>{
  try{
    // get all appointments with servuce and user info
    const result=await pool.query(
      `select a.*, s.service_name as service_name, u.name as user_name, u.email as user_email
       from appointments a
       join services s on a.service_id = s.id
       join users u on a.user_id = u.id
       order by a.appointment_date desc, a.appointment_time desc`
    );
    res.json(result.rows);
  } catch(err){
    res.status(500).json({ message:'Server error',error:err.message});
  }
};

// UPDATE STATUS OF APPOINTMWNT
const updateAppointmentStatus=async(req, res)=> {
  const {id}=req.params;
  // new status
  const {status}=req.body;

  // ALL STATUSUSE
  const validStatuses=['pending','approved','rejected'];
  if (!validStatuses.includes(status)){
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try{
    // update status
    const result=await pool.query(
      'update appointments set status=$1 where id=$2 returning *',
      [status,id]
    );

    if(result.rows.length===0){
      return res.status(404).json({message:'Appointment notfound'});
    }

    res.json(result.rows[0]);
  }catch(err){
    res.status(500).json({message:'Server error',error:err.message });
  }
};

// UPDATE APPOINTMENT
const updateAppointment=async(req,res)=>{
  const {id}=req.params;
  // the upated data
  const {service_id,appointment_date,appointment_time,notes}= req.body;
  const user_id=req.user.userId;

  try {
    //existing users appointments
    const existing=await pool.query(
      'select * from appointments where id=$1 and user_id=$2',
      [id, user_id]
    );

    if(existing.rows.length===0){
      return res.status(404).json({ message:'Appointment not found or unauthorized' });
    }

    // PENDING status
    if(existing.rows[0].status!=='pending'){
      return res.status(400).json({message:'Only pending appointments can be edited'});
    }

    // UPDATE APPOINTMENT
    const result=await pool.query(
      `update appointments
       set service_id=$1, appointment_date=$2, appointment_time=$3, notes=$4
       where id=$5 AND user_id=$6
       returning *`,
      [service_id,appointment_date,appointment_time,notes,id,user_id]
    );

    res.json(result.rows[0]);
  }catch(err){
    res.status(500).json({message:'Server error',error:err.message});
  }
};

// DELETE APPOINTMENT
const deleteAppointment=async(req,res)=>{
  const {id}=req.params;
  const user_id=req.user.userId;
  // jwt role
  const role=req.user.role;

  try {
    // delete appointment
    const query=role==='admin'
      ? 'delete from appointments where id=$1 returning id'
      : 'delete from appointments where id=$1 and user_id=$2 returning id';

    const params=role==='admin'?[id]:[id, user_id];
    const result=await pool.query(query,params);

    if (result.rows.length===0){
      return res.status(404).json({message:'Appointment not found or unauthorized'});
    }

    res.json({message:'Appointment deleted'});
  }catch(err){
    res.status(500).json({message:'Server error',error:err.message});
  }
};

module.exports={
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  updateAppointment,
  deleteAppointment,
};