import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import requireAdmin from '../middleware/requireAdmin.js';
import { exportOrdersCsv, exportUsersCsv, exportProductsCsv } from '../controllers/exportController.js';

const router = Router();

router.get('/export/orders.csv',  authMiddleware, requireAdmin, exportOrdersCsv);
router.get('/export/users.csv',   authMiddleware, requireAdmin, exportUsersCsv);
router.get('/export/products.csv',authMiddleware, requireAdmin, exportProductsCsv);

export default router;
