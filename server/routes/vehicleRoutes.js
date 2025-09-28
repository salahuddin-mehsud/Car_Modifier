import express from 'express';
import { vehicleController } from '../controllers/vehicleController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (optional authentication for guest users)
router.get('/', optionalAuth, vehicleController.getAllVehicles);
router.get('/options', optionalAuth, vehicleController.getVehicleOptions);
router.get('/packages', optionalAuth, vehicleController.getPackages);
router.get('/:id', optionalAuth, vehicleController.getVehicleById);

export default router;