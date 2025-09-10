import express from 'express';
import { getProductReviews, createReview, updateReview, deleteReview, getUserReviews, moderateReview } from '../models/reviewModel.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reviews/product/:productId - Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, page, limit } = req.query;
    
    const options = {};
    if (rating) options.rating = parseInt(rating);
    if (page) options.page = parseInt(page);
    if (limit) options.limit = parseInt(limit);
    
    const result = await getProductReviews(productId, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reviews/user - Get user's reviews
router.get('/user', requireAuth, async (req, res) => {
  try {
    const { page, limit } = req.query;
    
    const options = {};
    if (page) options.page = parseInt(page);
    if (limit) options.limit = parseInt(limit);
    
    const reviews = await getUserReviews(req.user.id, options);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reviews - Create a new review
router.post('/', requireAuth, async (req, res) => {
  try {
    const reviewData = {
      ...req.body,
      user_id: req.user.id
    };
    
    const reviewId = await createReview(reviewData);
    res.status(201).json({ id: reviewId, message: 'Review created successfully' });
  } catch (error) {
    if (error.message === 'User has already reviewed this product') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/reviews/:id - Update user's review
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updated = await updateReview(req.params.id, req.user.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }
    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/reviews/:id - Delete user's review
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await deleteReview(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/reviews/:id/moderate - Moderate review (Admin only)
router.put('/:id/moderate', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { approved } = req.body;
    const updated = await moderateReview(req.params.id, approved);
    if (!updated) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review moderated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;