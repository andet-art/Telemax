import { Router } from 'express';
import { createOrder, listMyOrders, getOrderById } from '../controllers/orderController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Create new order
router.post('/', requireAuth, createOrder);

// List orders for logged-in user
router.get('/mine', requireAuth, listMyOrders);

// Get single order (owner or admin logic is in controller)
router.get('/:id', requireAuth, getOrderById);

export default router;
