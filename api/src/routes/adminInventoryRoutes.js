import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import requireAdmin from '../middleware/requireAdmin.js';
import { setProductStock, setPartStock } from '../controllers/adminInventoryController.js';

const router = Router();

// PUT /api/admin/inventory/product/:id/stock  { stock }
router.put('/inventory/product/:id/stock', authMiddleware, requireAdmin, setProductStock);

// PUT /api/admin/inventory/part/:id/stock  { stock }
router.put('/inventory/part/:id/stock', authMiddleware, requireAdmin, setPartStock);

export default router;
