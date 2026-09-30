import { Router } from 'express';
import { login, getMe } from '../controllers/authController.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema } from '../schemas/authSchema.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/login', validateBody(loginSchema), login);
router.get('/me', requireAdmin, getMe);

export default router;
