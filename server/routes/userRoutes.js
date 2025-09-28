import express from 'express';
import { userController } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.get('/dashboard', authenticate, userController.getUserDashboard);
router.put('/preferences', authenticate, userController.updateUserPreferences);
router.put('/deactivate', authenticate, userController.deactivateAccount);

export default router;