import { z } from 'zod';

export const createRegistrationSchema = z.object({
  eventId: z.string().trim().min(1, 'Event ID is required'),
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  email: z.string().trim().toLowerCase().email('Invalid email address format'),
  college: z
    .string()
    .trim()
    .min(2, 'College or university name is required')
    .max(150, 'College name is too long'),
  academicYear: z.enum(
    ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Post Graduate', 'Other'],
    {
      errorMap: () => ({ message: 'Please select a valid academic year' }),
    }
  ),
  phone: z
    .string()
    .trim()
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,14}$/,
      'Please enter a valid phone number (minimum 10 digits)'
    ),
  notes: z.string().optional(),
});

export type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>;
