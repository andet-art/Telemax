import { Router } from 'express';
import {
  adminListOrders,
  getOrderById,
  adminUpdateStatus,
  adminSetTracking,
} from '../controllers/orderController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/orders', requireAuth, requireAdmin, adminListOrders);
router.get('/orders/:id', requireAuth, requireAdmin, getOrderById);
router.put('/orders/:id/status', requireAuth, requireAdmin, adminUpdateStatus);
router.put('/orders/:id/tracking', requireAuth, requireAdmin, adminSetTracking);

export default router;
