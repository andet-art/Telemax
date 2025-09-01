import { Router } from 'express';
import {
  adminListOrders,
  getOrderById,
  adminUpdateStatus,
  adminSetTracking,
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import requireAdmin from '../middleware/requireAdmin.js';

const router = Router();

router.get('/orders', authMiddleware, requireAdmin, adminListOrders);
router.get('/orders/:id', authMiddleware, requireAdmin, getOrderById);
router.put('/orders/:id/status', authMiddleware, requireAdmin, adminUpdateStatus);
router.put('/orders/:id/tracking', authMiddleware, requireAdmin, adminSetTracking);

export default router;
