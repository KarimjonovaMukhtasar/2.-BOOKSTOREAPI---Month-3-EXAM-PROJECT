import { z } from 'zod';

const authorValidate = z.object({
  name: z
    .string()
    .unique()
    .min(5, `TOO SHORT FOR A NAME`)
    .max(30, `TOO LONG FOR A NAME`),
  bio: z.text().min(5, `TOO SHORT FOR BIO`),
  birth_date: z.date().trim(),
});

const authorUpdate = z.object({
  name: z
    .string()
    .unique()
    .min(5, `TOO SHORT FOR A NAME`)
    .max(30, `TOO LONG FOR A NAME`)
    .optional(),
  bio: z.text().min(5, `TOO SHORT FOR BIO`).optional(),
  birth_date: z.date().trim().optional(),
});

export { authorUpdate, authorValidate };
