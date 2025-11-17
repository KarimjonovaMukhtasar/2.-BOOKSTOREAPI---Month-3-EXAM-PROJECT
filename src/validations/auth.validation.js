import { z } from 'zod';

const userRegisterValidate = z.object({
  username: z
    .string()
    .min(5, `TOO SHORT FOR A USERNAME`)
    .max(10, `TOO LONG FOR A USERNAME`),
  password: z
    .string()
    .min(6, `TOO SHORT FOR A PASSWORD`)
    .max(15, `TOO LONG FOR A PASSWORD`),
  email: z.string().email().trim().toLowerCase(),
  role: z.enum(['user', 'admin', 'superadmin']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  first_name: z
    .string()
    .trim()
    .min(2, `TOO SHORT FOR A FIRSTNAME`)
    .max(20, `TOO LONG FOR  A LASTNAME`),
  last_name: z
    .string()
    .trim()
    .min(2, `TOO SHORT FOR A LASTNAME`)
    .max(20, `TOO LONG FOR A LASTNAME`),
  phone_number: z.string().regex(/^\+\d{10,15}$/, 'Invalid phone number'),
  address: z
    .string()
    .min(10, `TOO SHORT FOR AN ADDRESS`)
    .max(40, 'TOO LONG FOR AN ADDRESS'),
});

const LoginValidate = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string(),
});

export { userRegisterValidate, LoginValidate};
