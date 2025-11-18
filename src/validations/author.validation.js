import { z } from 'zod';

const authorValidate = z.object({
  name: z
    .string()
    .min(5, `TOO SHORT FOR A NAME`)
    .max(30, `TOO LONG FOR A NAME`),
  bio: z.string().min(5, `TOO SHORT FOR BIO`),
  birth_date: z.preprocess((val) => {
    if (typeof val === 'string' || val instanceof Date) {
      return new Date(val);
    }
  }, z.date()),
});

const authorUpdate = z.object({
  name: z
    .string()
    .min(5, `TOO SHORT FOR A NAME`)
    .max(30, `TOO LONG FOR A NAME`)
    .optional(),
  bio: z.string().min(5, `TOO SHORT FOR BIO`).optional(),
  birth_date: z
    .preprocess((val) => {
      if (typeof val === 'string' || val instanceof Date) {
        return new Date(val);
      }
    }, z.date())
    .optional(),
});

export { authorUpdate, authorValidate };
