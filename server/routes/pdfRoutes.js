import express from 'express';
import { pdfController } from '../controllers/pdfController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.get('/build-report/:id', authenticate, pdfController.generateBuildReport);
router.get('/order-invoice/:id', authenticate, pdfController.generateOrderInvoice);

export default router;