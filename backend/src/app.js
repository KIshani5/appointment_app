const express=require('express');
const cors=require('cors');

const authRoutes=require('./routes/auth.routes');
const serviceRoutes=require('./routes/service.routes');
const appointmentRoutes=require('./routes/appointment.routes');

console.log('authRoutes:',typeof authRoutes);
console.log('serviceRoutes:',typeof serviceRoutes);
console.log('appointmentRoutes:',typeof appointmentRoutes);

const app= express();

app.use(cors());
app.use(express.json());

const path=require('path');
app.use(express.static(path.join(__dirname,'../../frontend')));

// api routes
app.use('/api/auth',authRoutes);
app.use('/api/services',serviceRoutes);
app.use('/api/appointments',appointmentRoutes);

// 404
app.use((req, res)=>{
  res.status(404).json({message:'Route not found' });
});

module.exports=app;