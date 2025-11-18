import { z } from 'zod';

const orderItemSchema = z.object({
  book_id: z.string().uuid('Invalid book ID format. Must be a UUID.'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1.'),
});

const orderValidate = z.object({
  items: z.array(orderItemSchema).min(1, 'The items array cannot be empty.'),
});

export { orderValidate };

