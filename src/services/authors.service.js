import db from '../db/knex.js';
import { ApiError } from '../helpers/errorMessage.js';

export const AuthorService = {
  async getAll({ query, page = 1, limit = 10 } = {}) {
    const pageN = parseInt(page);
    const limitN = parseInt(limit);
    if (isNaN(pageN) || pageN < 1) {
      throw new ApiError(400, 'Invalid page number');
    }
    if (isNaN(limitN) || limitN < 1) {
      throw new ApiError(400, 'Invalid limit'); 
    }
    const offset = (pageN - 1) * limitN;
    const searchableColumns = ['name', 'bio'];

    return db('authors')
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
    const searchableColumns = ['name', 'bio'];

    const [countResult] = await db('authors')
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
    const author = await db('authors').where({ id }).first();
    if (!author) {
      throw new ApiError(404, 'NOT FOUND SUCH AN AUTHOR ID');
    }
    return author;
  },

  async create(data) {
    const existing = await db('authors').where({ name: data.name }).first();
    if (existing) {
      throw new ApiError(401, 'Author with this name already exists');
    }
    const [author] = await db('authors').insert(data).returning('*');
    return author;
  },

  async update(id, data) {
    const [updated] = await db('authors')
      .where({ id })
      .update(data)
      .returning('*');
    return updated;
  },

  async remove(id) {
    return db('authors').where({ id }).del();
  },
};
