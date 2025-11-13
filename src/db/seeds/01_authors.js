/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import { v4 as uuid } from 'uuid';
export async function seed(knex) {
  await knex('authors').del();
  await knex('authors').insert([
    {
      id: uuid(),
      name: 'Col NewPort',
      bio: 'Psycho-Therapist',
      birth_date: '1990-02-10',
    },
    {
      id: uuid(),
      name: 'James Clear',
      bio: 'Neuro-surgeon',
      birth_date: '1985-10-10',
    },
    {
      id: uuid(),
      name: 'Muhammad Yusuf',
      bio: "O'zbek xalq shoiri",
      birth_date: '1999-12-12',
    },
    {
      id: uuid(),
      name: 'Usmon Nosir',
      bio: "O'zbek xalq shoiri",
      birth_date: '1976-04-14',
    },
  ]);
}
