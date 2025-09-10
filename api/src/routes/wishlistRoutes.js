import express from 'express';
import { getUserWishlist, addToWishlist, removeFromWishlist, isInWishlist, getWishlistCount, clearWishlist } from '../models/wishlistModel.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/wishlist - Get user's wishlist
router.get('/', requireAuth, async (req, res) => {
  try {
    const wishlist = await getUserWishlist(req.user.id);
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/wishlist/count - Get wishlist item count
router.get('/count', requireAuth, async (req, res) => {
  try {
    const count = await getWishlistCount(req.user.id);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/wishlist/check/:productId - Check if product is in wishlist
router.get('/check/:productId', requireAuth, async (req, res) => {
  try {
    const inWishlist = await isInWishlist(req.user.id, req.params.productId);
    res.json({ inWishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/wishlist - Add product to wishlist
router.post('/', requireAuth, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    const wishlistId = await addToWishlist(req.user.id, productId);
    res.status(201).json({ id: wishlistId, message: 'Product added to wishlist' });
  } catch (error) {
    if (error.message === 'Product already in wishlist') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/wishlist/:productId - Remove product from wishlist
router.delete('/:productId', requireAuth, async (req, res) => {
  try {
    const removed = await removeFromWishlist(req.user.id, req.params.productId);
    if (!removed) {
      return res.status(404).json({ error: 'Product not found in wishlist' });
    }
    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/wishlist - Clear entire wishlist
router.delete('/', requireAuth, async (req, res) => {
  try {
    const count = await clearWishlist(req.user.id);
    res.json({ message: `Removed ${count} items from wishlist` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;