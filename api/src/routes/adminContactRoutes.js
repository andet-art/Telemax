import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { adminListContacts, adminGetContact, adminResolveContact } from '../controllers/adminContactController.js';

const router = Router();

router.get('/contacts', requireAuth, requireAdmin, adminListContacts);
router.get('/contacts/:id', requireAuth, requireAdmin, adminGetContact);
router.put('/contacts/:id/resolve', requireAuth, requireAdmin, adminResolveContact);

export default router;
