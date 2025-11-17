import db  from '../db/knex.js';
import { ApiError } from '../helpers/errorMessage.js';

export const BookService = {
 async getAll({ query, page = 1, limit = 10 } = {}) {
  const pageN = parseInt(page);
  const limitN = parseInt(limit);
  if (isNaN(pageN) || pageN < 1) throw new ApiError(401, 'Invalid page number');
  if (isNaN(limitN) || limitN < 1) throw new ApiError(401, 'Invalid limit');

  const offset = (pageN - 1) * limitN;
  const info = await db('books').columnInfo();
  const columns = Object.entries(info)
    .filter(([name, col]) => ['varchar', 'text', 'character varying'].includes(col.type))
    .map(([name]) => name);

  const booksQuery = db('books')
    .modify((qb) => {
      if (query && columns.length > 0) {
        qb.where((builder) => {
          columns.forEach((col, index) => {
            if (index === 0) builder.whereILike(col, `%${query}%`);
            else builder.orWhereILike(col, `%${query}%`);
          });
        });
      }
    })
    .limit(limitN)
    .offset(offset)
    .orderBy('created_at', 'desc');

  const books = await booksQuery;
  const countQuery = db('books')
    .modify((qb) => {
      if (query && columns.length > 0) {
        qb.where((builder) => {
          columns.forEach((col, index) => {
            if (index === 0) builder.whereILike(col, `%${query}%`);
            else builder.orWhereILike(col, `%${query}%`);
          });
        });
      }
    })
    .count('id as total');

  const [{ total }] = await countQuery;

  return { books, totalCount: parseInt(total) };
}
,

  async getById(id) {
    const book = await db('books').where({ id }).first();
    if(!book){
      throw new ApiError(404, 'NOT FOUND SUCH A BOOK ID')
    }
    return book
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
