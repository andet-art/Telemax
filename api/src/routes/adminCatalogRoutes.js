import { Router } from 'express';
import {
  adminListProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from '../controllers/productController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Get all products (admin only)
router.get('/products', requireAuth, requireAdmin, adminListProducts);

// Create a new product
router.post('/products', requireAuth, requireAdmin, adminCreateProduct);

// Update a product by ID
router.put('/products/:id', requireAuth, requireAdmin, adminUpdateProduct);

// Delete a product by ID
router.delete('/products/:id', requireAuth, requireAdmin, adminDeleteProduct);

export default router;
