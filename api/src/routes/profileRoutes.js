import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getMe, updateMe } from '../controllers/profileController.js';

const router = Router();
router.get('/', requireAuth, getMe);
router.put('/', requireAuth, updateMe);
export default router;
