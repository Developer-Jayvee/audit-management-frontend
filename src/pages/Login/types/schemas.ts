import { z } from 'zod';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .refine((value) => EMAIL_PATTERN.test(value), 'Enter a valid email address.'),
});

export type EmailFormValues = z.infer<typeof emailSchema>;

export interface PasswordFormValues {
  password: string;
}
