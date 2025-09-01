import { Router } from 'express';
import {
  adminListUsers,
  adminUpdateUserRole,
  adminDeleteUser,
} from '../controllers/userController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// List all users
router.get('/users', requireAuth, requireAdmin, adminListUsers);

// Update user role (e.g., promote/demote admin)
router.put('/users/:id/role', requireAuth, requireAdmin, adminUpdateUserRole);

// Delete a user
router.delete('/users/:id', requireAuth, requireAdmin, adminDeleteUser);

export default router;
