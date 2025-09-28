import express from 'express';
import { body } from 'express-validator';
import { orderController } from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Validation rules
const createOrderValidation = [
  body('buildId').isMongoId().withMessage('Valid build ID is required'),
  body('shippingAddress.firstName').notEmpty().withMessage('First name is required'),
  body('shippingAddress.lastName').notEmpty().withMessage('Last name is required'),
  body('shippingAddress.street').notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.zipCode').notEmpty().withMessage('ZIP code is required'),
  body('paymentMethod').isIn(['credit_card', 'debit_card', 'paypal', 'stripe']).withMessage('Valid payment method is required')
];

// Protected routes
router.post('/', authenticate, createOrderValidation, handleValidationErrors, orderController.createOrder);
router.get('/', authenticate, orderController.getUserOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.put('/:id/status', authenticate, orderController.updateOrderStatus);
router.put('/:id/cancel', authenticate, orderController.cancelOrder);

export default router;