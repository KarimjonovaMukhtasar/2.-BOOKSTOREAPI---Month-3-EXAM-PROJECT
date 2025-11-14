/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('email').notNullable().unique();
    table.string('username').notNullable().unique()
    table.string('password').notNullable()
    table.string('last_name').notNullable()
    table.string('first_name').notNullable()
    table.string('phone_number').notNullable()
    table.string('address').notNullable()
    table.enum('role', ['user', 'admin', 'superadmin']).defaultTo('user');
    table.enum('status', ['active', 'inactive']).defaultTo('inactive');
    table.timestamps(true, true); 
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists('users');
}


