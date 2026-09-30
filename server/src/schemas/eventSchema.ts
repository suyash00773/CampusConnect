import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().trim().min(3, 'Event title must be at least 3 characters'),
  slug: z.string().trim().toLowerCase().optional(),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  shortDescription: z
    .string()
    .trim()
    .min(5, 'Short description must be at least 5 characters')
    .max(300, 'Short description cannot exceed 300 characters'),
  club: z.string().trim().min(1, 'Organizing club is required'),
  category: z.enum(
    ['Technical', 'Cultural', 'Sports', 'Workshop', 'Hackathon', 'Seminar', 'Social'],
    {
      errorMap: () => ({ message: 'Please select a valid event category' }),
    }
  ),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  startTime: z.string().trim().min(1, 'Start time is required (e.g. 10:00 AM)'),
  endTime: z.string().trim().min(1, 'End time is required (e.g. 04:00 PM)'),
  venue: z.string().trim().min(2, 'Venue is required'),
  locationType: z.enum(['In-Person', 'Virtual', 'Hybrid']).default('In-Person'),
  bannerUrl: z.string().trim().url('Banner URL must be a valid URL'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1 participant'),
  status: z.enum(['published', 'draft', 'completed', 'cancelled']).default('published'),
  featured: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
  requirements: z.array(z.string()).optional().default([]),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
