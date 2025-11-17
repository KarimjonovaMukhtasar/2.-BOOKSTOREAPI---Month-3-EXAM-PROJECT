import { z } from 'zod';

const bookValidate = z.object({
  title: z.string().trim().min(1, `BOOK TITLE CAN'T BE EMPTY`),
  author_id: z.string().uuid(),
  genre_id: z.string().uuid(),
  price: z.preprocess((val) => Number(val), z.number().positive()),
  stock: z.preprocess((val) => Number(val), z.number().positive()),
  status: z.preprocess(
    (val) => String(val).toLowerCase(),
    z.enum(['available', 'out of stock', 'discontinued']),
  ),
  published_date: z.preprocess((val) => {
    if (typeof val === 'string' || val instanceof Date) {
      return new Date(val);
    }
  }, z.date()),
  imageURLs: z.preprocess((val) => {
    if (typeof val === 'string') return [val];
    if (Array.isArray(val)) return val;
    return [];
  }, z.array(z.string().url())),
  decription: z.string().min(10, 'TOO SHORT FOR A DESCRIPTION').optional(),
});

const bookUpdate = z.object({
  title: z.string().trim().min(1, `BOOK TITLE CAN'T BE EMPTY`).optional(),
  author_id: z.string().uuid().optional(),
  genre_id: z.string().uuid().optional(),
  price: z.preprocess((val) => Number(val), z.number().positive()).optional(),
  stock: z.preprocess((val) => Number(val), z.number().positive()).optional(),
  status: z
    .preprocess(
      (val) => String(val).toLowerCase(),
      z.enum(['available', 'out of stock', 'discontinued']),
    )
    .optional(),
  published_date: z
    .preprocess((val) => {
      if (typeof val === 'string' || val instanceof Date) {
        return new Date(val);
      }
    }, z.date())
    .optional(),
  imageURLs: z
    .preprocess((val) => {
      if (typeof val === 'string') return [val];
      if (Array.isArray(val)) return val;
      return [];
    }, z.array(z.string().url()))
    .optional(),
  decription: z.string().min(10, 'TOO SHORT FOR A DESCRIPTION').optional(),
});

export { bookValidate, bookUpdate };
