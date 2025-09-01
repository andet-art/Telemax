import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { setProductStock, setPartStock } from '../controllers/adminInventoryController.js';

const router = Router();

// PUT /api/admin/inventory/product/:id/stock  { stock }
router.put('/inventory/product/:id/stock', requireAuth, requireAdmin, setProductStock);

// PUT /api/admin/inventory/part/:id/stock  { stock }
router.put('/inventory/part/:id/stock', requireAuth, requireAdmin, setPartStock);

export default router;
