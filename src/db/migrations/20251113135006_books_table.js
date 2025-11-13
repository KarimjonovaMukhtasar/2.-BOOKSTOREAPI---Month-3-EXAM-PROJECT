/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.createTable('books', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title').notNullable();
    table.uuid('author_id').notNullable();
    table.foreign('author_id').references('id').inTable('authors').onDelete('CASCADE');
    table.uuid('genre_id').notNullable();
    table.foreign('genre_id').references('id').inTable('genres').onDelete('CASCADE');
    table.decimal('price').notNullable();
    table.integer('stock').notNullable();
    table.date('publishedDate').notNullable();
    table.enum('status', ['available', 'out of stock', 'discontinued']);
    table.specificType('imageURLs', 'text[]');
    table.text('decription');
    table.timestamps(true, true); 
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists('books');
}

