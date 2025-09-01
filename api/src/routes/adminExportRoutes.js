import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { exportOrdersCsv, exportUsersCsv, exportProductsCsv } from '../controllers/exportController.js';

const router = Router();

router.get('/export/orders.csv',  requireAuth, requireAdmin, exportOrdersCsv);
router.get('/export/users.csv',   requireAuth, requireAdmin, exportUsersCsv);
router.get('/export/products.csv',requireAuth, requireAdmin, exportProductsCsv);

export default router;
