/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import { v4 as uuid } from 'uuid';
export async function seed(knex) {
  await knex('genres').del();
  await knex('genres').insert([
    {
      id: uuid(),
      name: 'Romance',
      description: 'exaggerations and full of lies to deceieve others :)',
    },
    {
      id: uuid(),
      name: 'Science-Fiction',
      description: 'just myths and imaginative works',
    },
    {
      id: uuid(),
      name: 'Religious',
      description: 'reality, lifehacks, moral and spiritual developments',
    },
    { id: uuid(), name: 'Scientific', description: 'Factful database' },
  ]);
}
