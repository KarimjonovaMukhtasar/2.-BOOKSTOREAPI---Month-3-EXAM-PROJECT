import db from '../db/knex.js';
import { ApiError } from '../helpers/errorMessage.js';

export const UserService = {
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
    const searchableColumns = ['username', 'role', 'first_name', 'last_name', 'address', 'email'];

    return db('users')
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
    const searchableColumns = ['username', 'role', 'first_name', 'last_name', 'address', 'email'];
    const [countResult] = await db('users')
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
    const user = await db('users').where({ id }).first();
    if (!user) {
      throw new ApiError(404, 'NOT FOUND SUCH A USER ID');
    }
    return user;
  },

  async create(data) {
    const existing = await db('users').where({ email: data.email }).first();
    if (existing) {
      throw new ApiError(401, 'User with this email already exists');
    }
    const [user] = await db('users').insert(data).returning('*');
    return user;
  },

  async update(id, data) {
    const [updated] = await db('users')
      .where({ id })
      .update(data)
      .returning('*');
    return updated;
  },

  async remove(id) {
    return db('users').where({ id }).del();
  },
};
