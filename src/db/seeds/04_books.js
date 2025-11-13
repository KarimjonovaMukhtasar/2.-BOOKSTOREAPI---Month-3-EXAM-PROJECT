/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import { v4 as uuid } from 'uuid';
export async function seed(knex) {
  await knex('books').del();
  await knex('books').insert([
    {
      id: uuid(),
      title: 'ATOMIC HABITS',
      author_id: '94b6234f-6736-4273-8698-d4162f93d34f',
      genre_id: 'bb1f1cea-f0fc-4c28-9cc3-dbb1304ae804',
      price: 80.000,
      stock: 6,
      publishedDate: '2020-10-20',
      status: 'available',
      imageURLs: ['https/atomic_habits'],
      description: 'discipline based, time-management'
    },
    {
      id: uuid(),
      title: 'SENSE AND SENSEBILITY',
      author_id: '408a91d2-fa21-46db-8747-fe102175c056',
      genre_id: '9e38c6d9-d283-4b51-b81b-5f2f5ca759c6',
      price: 50.000,
      stock: 25,
      publishedDate: '2012-11-20',
      status: 'available',
      imageURLs: ['https/sense-and-sensebility'],
      description: 'royalty, shame and pride and prejudice'
    },
    {
      id: uuid(),
      title: 'Harry Potter',
      author_id: '64579afd-ba17-4f4e-8bfa-edf2f567c07f',
      genre_id: '271d0afd-8265-43f0-b5a3-8dfe478b9aaa',
      price: 60.000,
      stock: 12,
      publishedDate: '2010-11-20',
      status: 'available',
      imageURLs: ['https/harry-potter'],
      description: 'magic bravery truth justice'
    },
    {
      id: uuid(),
      title: 'Who cries when you die?',
      author_id: '0b128527-50e1-4ae0-972f-ca6934db7ad9',
      genre_id: 'ab45d810-e475-40e4-8c1c-175e5fc1b7b7',
      price: 40.000,
      stock: 98,
      publishedDate: '2025-11-20',
      status: 'available',
      imageURLs: ['https/who-cries-when-you-die'],
      description: 'life lessons bitter truth'
    },
  ]);
}
