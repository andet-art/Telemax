import express from 'express';
import { request2FA, verify2FA } from '../controllers/twofaController.js';
const router = express.Router();
router.post('/request-2fa', request2FA);
router.post('/verify-2fa', verify2FA);
export default router;
