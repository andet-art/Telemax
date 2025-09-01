import { Router } from 'express';
import { createOrder, listMyOrders, getOrderById } from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Create new order
router.post('/', authMiddleware, createOrder);

// List orders for logged-in user
router.get('/mine', authMiddleware, listMyOrders);

// Get single order (owner or admin logic is in controller)
router.get('/:id', authMiddleware, getOrderById);

export default router;
