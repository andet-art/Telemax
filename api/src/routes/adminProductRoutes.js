import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import requireAdmin from '../middleware/requireAdmin.js';
import {
  adminListProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct
} from '../controllers/productController.js';

const router = Router();

router.get('/products', authMiddleware, requireAdmin, adminListProducts);
router.post('/products', authMiddleware, requireAdmin, adminCreateProduct);
router.put('/products/:id', authMiddleware, requireAdmin, adminUpdateProduct);
router.delete('/products/:id', authMiddleware, requireAdmin, adminDeleteProduct);

export default router;
