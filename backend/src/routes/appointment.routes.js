const express=require('express');
const router=express.Router();
const {authenticate,requireAdmin}=require('../auth');
const{
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
}=require('../controllers/appointment.controller');
// user create
router.post('/', authenticate, createAppointment);
// user get 
router.get('/my', authenticate, getMyAppointments); 
// admin get
router.get('/all', authenticate, requireAdmin, getAllAppointments);  
// admin 
router.put('/:id/status', authenticate, requireAdmin, updateAppointmentStatus); 
// admin update
router.put('/:id', authenticate, updateAppointment); 
// both user and admin delte
router.delete('/:id', authenticate, deleteAppointment);       

module.exports= router;