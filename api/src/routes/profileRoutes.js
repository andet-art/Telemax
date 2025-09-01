import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getMe, updateMe } from '../controllers/profileController.js';

const router = Router();
router.get('/', authMiddleware, getMe);
router.put('/', authMiddleware, updateMe);
export default router;
