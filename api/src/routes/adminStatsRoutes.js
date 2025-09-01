import { Router } from 'express';
import { getAdminStats } from '../controllers/statsController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import requireAdmin from '../middleware/requireAdmin.js';

const router = Router();

// Admin dashboard stats
router.get('/', authMiddleware, requireAdmin, getAdminStats);

export default router;
