import knex from "knex";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(import.meta.url, '../../.env') });

import config from "../../knexfile.js";

const db = knex(config.development);

export default db;