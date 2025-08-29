import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        name: z.string({ error: 'Email required' }).trim().min(3, { message: 'Min 3 characters' }),
        email: z.email({ error: 'Invalid email' }).trim(),
        password: z
            .string()
            .trim()
            .min(6, { message: 'Min 6 characters' })
            .regex(/[A-Z]/, { message: 'Need uppercase letter' })
            .regex(/\d/, { message: 'Need a number' }),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.email({ error: 'Invalid email' }).trim(),
        password: z
            .string({ error: 'Email required' })
            .trim()
            .min(6, { message: 'Min 6 characters' }),
    }),
});
