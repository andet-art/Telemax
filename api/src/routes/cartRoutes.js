import express from 'express';
import { getCart, saveCart, clearCart, migrateCartToUser } from '../models/cartModel.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/cart - Get user's cart
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;
    
    if (!userId && !sessionId) {
      return res.status(400).json({ error: 'User ID or session ID required' });
    }
    
    const cart = await getCart(userId, sessionId);
    res.json(cart || { cart_data: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cart - Save cart data
router.post('/', async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;
    const { cartData } = req.body;
    
    if (!userId && !sessionId) {
      return res.status(400).json({ error: 'User ID or session ID required' });
    }
    
    if (!cartData) {
      return res.status(400).json({ error: 'Cart data required' });
    }
    
    const result = await saveCart(cartData, userId, sessionId);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/cart - Clear cart
router.delete('/', async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;
    
    if (!userId && !sessionId) {
      return res.status(400).json({ error: 'User ID or session ID required' });
    }
    
    const result = await clearCart(userId, sessionId);
    res.json({ success: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cart/migrate - Migrate anonymous cart to user cart
router.post('/migrate', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }
    
    const result = await migrateCartToUser(sessionId, userId);
    res.json({ success: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;