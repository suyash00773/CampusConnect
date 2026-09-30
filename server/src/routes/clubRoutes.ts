import { Router } from 'express';
import {
  getClubs,
  getClub,
  createClub,
  updateClub,
  deleteClub,
} from '../controllers/clubController.js';
import { requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createClubSchema, updateClubSchema } from '../schemas/clubSchema.js';

const router = Router();

// Public routes
router.get('/', getClubs);
router.get('/:idOrSlug', getClub);

// Admin-only protected routes
router.post('/', requireAdmin, validateBody(createClubSchema), createClub);
router.put('/:id', requireAdmin, validateBody(updateClubSchema), updateClub);
router.delete('/:id', requireAdmin, deleteClub);

export default router;
