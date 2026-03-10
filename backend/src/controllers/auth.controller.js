// postgresqll
const pool= require('../db');
// hashing
const bcrypt= require('bcrypt');
// authenticaiton
const jwt =require('jsonwebtoken');
//
const SALT_ROUNDS=10;

// REGISTER user
const register=async(req,res)=>{
  const{name,email,password}=req.body;

  if(!name||!email||!password){
    return res.status(400).json({ message:'All fields are required'});
  }

  try{
    // CHECKING iF MAIL EXISTS
    const existing=await pool.query('select id from users where email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message:'Email already registered' });
    }

    const hashedPassword=await bcrypt.hash(password, SALT_ROUNDS);

    // new user insert
    const result=await pool.query(
      'insert into users (name, email, password) values ($1,$2,$3) returning id,name,email,role',
      [name,email,hashedPassword]
    );

    res.status(201).json({ message:'User registered successfully', user:result.rows[0]});
  } catch (err) {
    res.status(500).json({ message:'Server error',error:err.message});
  }
};

// USER LOGIN 
const login=async (req,res)=>{
  const {email,password}=req.body;

  if(!email||!password){
    return res.status(400).json({ message:'Email and password required'});
  }

  try{
    // finding user by mail
    const result=await pool.query('select * from users where email = $1', [email]);
    const user = result.rows[0];

    if(!user){
      return res.status(401).json({message:'Invalid credentials'});
    }

    // compare password
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(401).json({message:'Invalid credentials'});
    }

    // jwt token creation
    const token=jwt.sign(
      {userId:user.id,role:user.role},
      process.env.JWT_SECRET,
      {expiresIn:'8h'}
    );

  // send
    res.json({
      message:'Login successful',
      token,
      user:{id:user.id,name:user.name,email:user.email,role:user.role },
    });
  }catch(err){
    res.status(500).json({message:'Server error',error:err.message});
  }
};

module.exports ={register,login};