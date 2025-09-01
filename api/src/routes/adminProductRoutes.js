import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  adminListProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct
} from '../controllers/productController.js';

const router = Router();

router.get('/products', requireAuth, requireAdmin, adminListProducts);
router.post('/products', requireAuth, requireAdmin, adminCreateProduct);
router.put('/products/:id', requireAuth, requireAdmin, adminUpdateProduct);
router.delete('/products/:id', requireAuth, requireAdmin, adminDeleteProduct);

export default router;
