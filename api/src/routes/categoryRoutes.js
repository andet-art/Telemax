import express from 'express';
import { getAllCategories, getCategoryById, getCategoryBySlug, createCategory, updateCategory, deleteCategory, getCategoriesWithProductCount } from '../models/categoryModel.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
  try {
    const { parent_id, with_count } = req.query;
    
    let categories;
    if (with_count === 'true') {
      categories = await getCategoriesWithProductCount();
    } else {
      categories = await getAllCategories(parent_id || null);
    }
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/categories/:id - Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/categories/slug/:slug - Get category by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const category = await getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/categories - Create new category (Admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const categoryId = await createCategory(req.body);
    const category = await getCategoryById(categoryId);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/categories/:id - Update category (Admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const updated = await updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Category not found or no changes made' });
    }
    const category = await getCategoryById(req.params.id);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/categories/:id - Delete category (Admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const deleted = await deleteCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;