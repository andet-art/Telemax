import { Router } from 'express';
import {
  adminListUsers,
  adminUpdateUserRole,
  adminDeleteUser,
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import requireAdmin from '../middleware/requireAdmin.js';

const router = Router();

// List all users
router.get('/users', authMiddleware, requireAdmin, adminListUsers);

// Update user role (e.g., promote/demote admin)
router.put('/users/:id/role', authMiddleware, requireAdmin, adminUpdateUserRole);

// Delete a user
router.delete('/users/:id', authMiddleware, requireAdmin, adminDeleteUser);

export default router;
