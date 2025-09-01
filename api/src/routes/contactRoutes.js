import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { submitContact } from '../controllers/contactController.js';

const router = Router();
// Allow anonymous or authenticated; if you want auth-only, add authMiddleware
router.post('/', submitContact);

export default router;
