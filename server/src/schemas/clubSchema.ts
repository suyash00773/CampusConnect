import { z } from 'zod';

export const createClubSchema = z.object({
  name: z.string().trim().min(2, 'Club name must be at least 2 characters'),
  slug: z.string().trim().toLowerCase().optional(),
  category: z.string().trim().min(2, 'Category is required'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  logoUrl: z.string().trim().url('Logo URL must be valid').optional(),
  bannerUrl: z.string().trim().url('Banner URL must be valid').optional(),
  leadName: z.string().trim().min(2, 'Club lead name is required'),
  leadEmail: z.string().trim().email('Valid lead email is required'),
  memberCount: z.coerce.number().int().min(0).optional().default(0),
  isFeatured: z.boolean().optional().default(false),
  socialLinks: z
    .object({
      instagram: z.string().optional().default(''),
      linkedin: z.string().optional().default(''),
      github: z.string().optional().default(''),
      website: z.string().optional().default(''),
    })
    .optional(),
});

export const updateClubSchema = createClubSchema.partial();

export type CreateClubInput = z.infer<typeof createClubSchema>;
export type UpdateClubInput = z.infer<typeof updateClubSchema>;
