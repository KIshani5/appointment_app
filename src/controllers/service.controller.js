// postgresqll
const pool=require('../db');

// SERVICES LIST
const getAllServices=async(req,res)=>{
  try{
    // get all
    const result=await pool.query('select * from services order by created_time desc');
    res.json(result.rows);
  }catch(err){
    res.status(500).json({message:'Server error',error:err.message});
  }
};

// CREAET SERVICE
const createService=async(req,res)=>{
  const{name,description,duration_minutes}=req.body;

  if(!name){
    return res.status(400).json({message:'Service name is needed'});
  }

  try{
    // new servoce insert
    const result=await pool.query(
      'insert into services (service_name, description, duration_minutes) values ($1, $2, $3) returning *',
      [name,description,duration_minutes||30]
    );
    res.status(201).json(result.rows[0]);
  }catch(err){
    res.status(500).json({message:'Server error',error:err.message});
  }
};

// update SERVICE
const updateService=async(req,res)=>{
  const {id}=req.params;
  const {name,description,duration_minutes}=req.body;

  try{
    const result=await pool.query(
      'update services set service_name=$1, description=$2, duration_minutes=$3 where id=$4 returning *',
      [name,description,duration_minutes,id]
    );

    if(result.rows.length===0){
      return res.status(404).json({message:'Service not found' });
    }

    res.json(result.rows[0]);
  } catch(err){
    res.status(500).json({message:'Server error',error:err.message});
  }
};

// DLETED SERVICE
const deleteService=async(req,res)=>{
  const{id}=req.params;

  try{
    // delete by id
    const result=await pool.query('delete from services where id=$1 returning id', [id]);

    if(result.rows.length===0){
      return res.status(404).json({message:'Service not found' });
    }

    res.json({message:'Service deleted successfully'});
  }catch(err){
    res.status(500).json({message:'Server error',error:err.message});
  }
};

module.exports=
{
  getAllServices,
  createService,
  updateService,
  deleteService 
};