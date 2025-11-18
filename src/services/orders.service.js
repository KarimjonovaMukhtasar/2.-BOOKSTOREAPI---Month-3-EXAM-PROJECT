import db from '../db/knex.js';
import { ApiError } from '../helpers/errorMessage.js';

export const OrderService = {
  async getAll({ query, page = 1, limit = 10 } = {}) {
    const pageN = parseInt(page);
    const limitN = parseInt(limit);
    if (isNaN(pageN) || pageN < 1) {
      throw new ApiError(401, 'Invalid page number');
    }
    if (isNaN(limitN) || limitN < 1) {
      throw new ApiError(401, 'Invalid limit');
    }
    const offset = (pageN - 1) * limitN;
    const columns = await db('orders')
      .columnInfo()
      .then((info) =>
        Object.entries(info)
          .filter(([col]) =>
            ['character varying', 'varchar', 'text'].includes(col.type),
          )
          .map(([name]) => name),
      );
    return db('orders')
      .modify((qb) => {
        if (query) {
          qb.where((builder) => {
            columns.forEach((col, index) => {
              if (index === 0) {
                builder.whereILike(col, `%${query}%`);
              } else {
                builder.orWhereILike(col, `%${query}%`);
              }
            });
          });
        }
      })
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc');
  },

  async getById(id) {
    const order = await db('orders').where({ id }).first();
    if (!order) {
      throw new ApiError(404, 'NOT FOUND SUCH AN ORDER ID');
    }
    return order;
  },

  async create(data) {
    return await db.transaction(async (trx) => {
      let totalPrice = 0;
      const orderItems = [];
      for (const item of data.items) {
        const book = await trx('books').where({ id: item.book_id }).first();
        if (!book) {
          throw new ApiError(404, `Book not found: ${item.book_id}`);
        }
        if (book.stock < item.quantity) {
          throw new ApiError(
            400,
            `Not enough stock for ${book.title}. Requested: ${item.quantity}, available: ${book.stock}`,
          );
        }
        if (book.status === 'out of stock') {
          throw new ApiError(
            400,
            `Not enough stock for ${book.title}. Requested: ${item.quantity}, Book status: ${book.status}`,
          );
        }
        if (book.status === 'discontinued') {
          throw new ApiError(
            400,
            `THIS BOOK ${book.title} is no longer being printed! Sorry, Book status: ${book.status}`,
          );
        }
        if (book.stock === item.quantity) {
          book.status = 'out of stock';
        }
        totalPrice += book.price * item.quantity;
        await trx('books')
          .where({ id: item.book_id })
          .update({
            stock: book.stock - item.quantity,
            status: book.status,
          });
        orderItems.push({
          book_id: item.book_id,
          quantity: item.quantity,
        });
      }
      const newOrder = await trx('orders').insert({
        user_id: data.user_id,
        total_price: totalPrice,
        items: JSON.stringify(orderItems),
        status: 'completed'
      });
      if (newOrder) {
        newOrder.user = await trx('users')
          .where({ id: data.user_id })
          .first();
      }
      return newOrder;
    });
  },
};
