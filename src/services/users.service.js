import db  from '../db/knex.js';
import { ApiError } from '../helpers/errorMessage.js';

export const UserService = {
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
    const columns = await db('users')
      .columnInfo()
      .then((info) =>
        Object.entries(info)
          .filter(([col]) =>
            ['character varying', 'varchar', 'text'].includes(col.type),
          )
          .map(([name]) => name),
      );
    return db('users')
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
    const user = await db('users').where({ id }).first();
    if(!user){
      throw new ApiError(404, 'NOT FOUND SUCH A USER ID')
    }
    return user
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
