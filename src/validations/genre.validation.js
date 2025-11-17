import { z } from 'zod';

const genreValidate = z.object({
  name: z
    .string()
    .trim()
    .min(5, `TOO SHORT FOR A GENRE NAME`)
    .max(20, `TOO LONG FOR A GENRE NAME`),
  description: z
    .string()
    .trim()
    .min(10, 'TOO SHORT FOR A DESCRIPTION')
    .optional(),
});

const genreUpdate = z.object({
  name: z
    .string()
    .trim()
    .min(5, `TOO SHORT FOR A GENRE NAME`)
    .max(20, `TOO LONG FOR A GENRE NAME`)
    .optional(),
  description: z
    .string()
    .trim()
    .min(10, 'TOO SHORT FOR A DESCRIPTION')
    .optional(),
});

export { genreValidate, genreUpdate };
