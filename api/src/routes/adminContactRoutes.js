import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import requireAdmin from '../middleware/requireAdmin.js';
import { adminListContacts, adminGetContact, adminResolveContact } from '../controllers/adminContactController.js';

const router = Router();

router.get('/contacts', authMiddleware, requireAdmin, adminListContacts);
router.get('/contacts/:id', authMiddleware, requireAdmin, adminGetContact);
router.put('/contacts/:id/resolve', authMiddleware, requireAdmin, adminResolveContact);

export default router;
