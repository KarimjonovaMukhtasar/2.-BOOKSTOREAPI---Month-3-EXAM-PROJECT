import db from '../db/knex.js';
import { ApiError } from '../helpers/errorMessage.js';

export const BookService = {
  async getAll({ query, page = 1, limit = 10 } = {}) {
    const pageN = parseInt(page);
    const limitN = parseInt(limit);
    if (isNaN(pageN) || pageN < 1)
      throw new ApiError(400, 'Invalid page number');
    if (isNaN(limitN) || limitN < 1) throw new ApiError(400, 'Invalid limit');
      const offset = (pageN - 1) * limitN;
    const searchableColumns = ['title', 'decription'];
    return db('books')
      .modify((qb) => {
        if (query) {
          const searchTerm = `%${query}%`; 
          qb.where((builder) => {
            searchableColumns.forEach((col, index) => {
              if (index === 0) {
                builder.whereILike(col, searchTerm);
              } else {
                builder.orWhereILike(col, searchTerm);
              }
            });
          });
        }
      })
      .limit(limitN) 
      .offset(offset)
      .orderBy('created_at', 'desc');
  },
  async countAll({ query } = {}) {
    const searchableColumns = ['title', 'decription'];
    const [countResult] = await db('books')
      .modify((qb) => {
        if (query) {
          const searchTerm = `%${query}%`;
          qb.where((builder) => {
            searchableColumns.forEach((col, index) => {
              if (index === 0) {
                builder.whereILike(col, searchTerm);
              } else {
                builder.orWhereILike(col, searchTerm);
              }
            });
          });
        }
      })
      .count('id as count');
    return parseInt(countResult.count);
  },

  async getById(id) {
    const book = await db('books').where({ id }).first();
    if (!book) {
      throw new ApiError(404, 'NOT FOUND SUCH A BOOK ID');
    }
    return book;
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
