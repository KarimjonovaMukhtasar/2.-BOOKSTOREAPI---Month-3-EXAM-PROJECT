import { db } from '../db/knex.js';
import { ApiError } from '../helpers/errorMessage.js';

export const BookService = {
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
    const columns = await db('books')
      .columnInfo()
      .then((info) =>
        Object.entries(info)
          .filter(([_, col]) =>
            ['character varying', 'varchar', 'text'].includes(col.type),
          )
          .map(([name]) => name),
      );
    return db('books')
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
    return db('books').where({ id }).first();
  },

  async create(data) {
    const existing = await db('books').where({ title: data.title }).first();
    if (existing) {
      throw new ApiError(401, 'Book with this title already exists');
    }
    const [book] = await db('books').insert(data).returning('*');
    return book;
  },

  async update(id, data) {
    const [updated] = await db('books')
      .where({ id })
      .update(data)
      .returning('*');
    return updated;
  },

  async remove(id) {
    return db('books').where({ id }).del();
  },
};
