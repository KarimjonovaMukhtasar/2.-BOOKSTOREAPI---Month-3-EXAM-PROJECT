import db from '../db/knex.js';
import { ApiError } from '../helpers/errorMessage.js';

export const GenreService = {
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
    const searchableColumns = ['name', 'description'];
    return db('genres')
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
    const searchableColumns = ['name', 'description'];

    const [countResult] = await db('genres')
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
    const genre = await db('genres').where({ id }).first();
    if (!genre) {
      throw new ApiError(404, 'NOT FOUND SUCH A GENRE ID');
    }
    return genre;
  },

  async create(data) {
    const existing = await db('genres').where({ name: data.name }).first();
    if (existing) {
      throw new ApiError(401, 'Genre with this name already exists');
    }
    const [genre] = await db('genres').insert(data).returning('*');
    return genre;
  },

  async update(id, data) {
    const [updated] = await db('genres')
      .where({ id })
      .update(data)
      .returning('*');
    return updated;
  },

  async remove(id) {
    return db('genres').where({ id }).del();
  },
};
