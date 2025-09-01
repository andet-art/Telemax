import { Router } from 'express';
import {
  adminListProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from '../controllers/productController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import requireAdmin from '../middleware/requireAdmin.js';

const router = Router();

// Get all products (admin only)
router.get('/products', authMiddleware, requireAdmin, adminListProducts);

// Create a new product
router.post('/products', authMiddleware, requireAdmin, adminCreateProduct);

// Update a product by ID
router.put('/products/:id', authMiddleware, requireAdmin, adminUpdateProduct);

// Delete a product by ID
router.delete('/products/:id', authMiddleware, requireAdmin, adminDeleteProduct);

export default router;
