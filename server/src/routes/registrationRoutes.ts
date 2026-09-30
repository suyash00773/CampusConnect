import { Router } from 'express';
import {
  register,
  getRegistrations,
  deleteRegistration,
  exportCsv,
} from '../controllers/registrationController.js';
import { requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createRegistrationSchema } from '../schemas/registrationSchema.js';

const router = Router();

// Public student registration
router.post('/', validateBody(createRegistrationSchema), register);

// Admin-only protected registration management
router.get('/', requireAdmin, getRegistrations);
router.get('/export/csv', requireAdmin, exportCsv);
router.delete('/:id', requireAdmin, deleteRegistration);

export default router;
