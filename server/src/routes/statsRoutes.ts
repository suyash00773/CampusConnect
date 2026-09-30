import { Router } from 'express';
import { getStats, seedDatabase } from '../controllers/statsController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAdmin, getStats);
router.post('/seed', seedDatabase);

export default router;
