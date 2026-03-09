const express=require('express');
const router=express.Router();
const {authenticate,requireAdmin}=require('../auth');
const{
  getAllServices,
  createService,
  updateService,
  deleteService,
}=require('../controllers/service.controller');

// get all appointments
router.get('/', getAllServices);
// cfeate service
router.post('/', authenticate, requireAdmin, createService);
// update swervice
router.put('/:id', authenticate, requireAdmin, updateService);
// delete service
router.delete('/:id', authenticate, requireAdmin, deleteService);

module.exports= router;