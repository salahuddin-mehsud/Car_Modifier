import express from 'express';
import { body } from 'express-validator';
import { configuratorController } from '../controllers/configuratorController.js';
import { authenticate, optionalAuth } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Validation rules
const calculatePriceValidation = [
  body('vehicleId').isMongoId().withMessage('Valid vehicle ID is required')
];

const calculateEMIValidation = [
  body('principal').isFloat({ min: 0 }).withMessage('Principal must be a positive number'),
  body('annualInterestRate').isFloat({ min: 0 }).withMessage('Interest rate cannot be negative'),
  body('tenureMonths').isInt({ min: 1 }).withMessage('Tenure must be at least 1 month')
];

const saveBuildValidation = [
  body('name').notEmpty().withMessage('Build name is required'),
  body('vehicleId').isMongoId().withMessage('Valid vehicle ID is required')
];

// Public routes
router.post('/calculate-price', optionalAuth, calculatePriceValidation, handleValidationErrors, configuratorController.calculatePrice);
router.post('/calculate-emi', optionalAuth, calculateEMIValidation, handleValidationErrors, configuratorController.calculateEMI);

// Protected routes (require authentication)
router.post('/builds', authenticate, saveBuildValidation, handleValidationErrors, configuratorController.saveBuild);
router.get('/builds', authenticate, configuratorController.getUserBuilds);
router.get('/builds/:id', authenticate, configuratorController.getBuildById);
router.put('/builds/:id', authenticate, configuratorController.updateBuild);
router.delete('/builds/:id', authenticate, configuratorController.deleteBuild);

export default router;