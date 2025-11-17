// table.uuid('user_id').notNullable();
//     table.jsonb('items').notNullable();
//     table.decimal('total_price');
//     table.enum('status', ['pending', 'completed', 'cancelled']).defaultTo('pending')

import { z } from 'zod';

const orderItemSchema = z.object({
  book_id: z.string().uuid('Invalid book ID format. Must be a UUID.'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1.'),
});

const orderValidate = z.object({
  user_id: z.uuid().trim(),
  items: z.array(orderItemSchema).min(1, 'The items array cannot be empty.'),
});

export { orderValidate };
