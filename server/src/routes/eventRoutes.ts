import { Router } from 'express';
import {
  getEvents,
  getFeaturedEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createEventSchema, updateEventSchema } from '../schemas/eventSchema.js';

const router = Router();

// Public routes
router.get('/', getEvents);
router.get('/featured', getFeaturedEvents);
router.get('/:idOrSlug', getEvent);

// Admin-only protected routes
router.post('/', requireAdmin, validateBody(createEventSchema), createEvent);
router.put('/:id', requireAdmin, validateBody(updateEventSchema), updateEvent);
router.delete('/:id', requireAdmin, deleteEvent);

export default router;
