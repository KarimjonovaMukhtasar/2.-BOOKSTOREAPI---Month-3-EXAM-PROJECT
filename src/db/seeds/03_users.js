/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import { v4 as uuid } from 'uuid';
export async function seed(knex) {
  await knex('users').del();
  await knex('users').insert([
    {
      id: uuid(),
      email: 'alivaliyev13@gmail.com',
      username: 'ali777',
      password: 'ali77',
      role: 'user',
      status: 'inactive',
    },
    {
      id: uuid(),
      email: 'salimhalimov21@gmail.com',
      username: 'salimhalim',
      password: 'salimbek77',
      role: 'user',
      status: 'inactive',
    },
    {
      id: uuid(),
      email: 'hilolabonu88@gmail.com',
      username: 'hilolabonu',
      password: 'hilolabonu888',
      role: 'user',
      status: 'inactive',
    },
  ]);
}
