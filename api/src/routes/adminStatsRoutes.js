import { Router } from 'express';
import { getAdminStats } from '../controllers/statsController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Admin dashboard stats
router.get('/', requireAuth, requireAdmin, getAdminStats);

export default router;
