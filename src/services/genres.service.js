import db  from '../db/knex.js';
import { ApiError } from '../helpers/errorMessage.js';

export const GenreService = {
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
    const columns = await db('genres')
      .columnInfo()
      .then((info) =>
        Object.entries(info)
          .filter(([col]) =>
            ['character varying', 'varchar', 'text'].includes(col.type),
          )
          .map(([name]) => name),
      );
    return db('genres')
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
    const genre= await db('genres').where({ id }).first();
    if(!genre){
      throw new ApiError(404, 'NOT FOUND SUCH A GENRE ID')
    }
    return genre
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
