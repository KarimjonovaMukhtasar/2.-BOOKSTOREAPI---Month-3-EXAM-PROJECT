import  db from '../db/knex.js';
import bcrypt from 'bcrypt';

export async function createDefaultAdmins() {
  try {
    const users = [
      {
        email: 'yusupovabarchinoy287@gmail.com',
        username: 'adminka',
        first_name: 'Admin',
        last_name: 'ADMIN',
        phone_number: '+1234561234546',
        role: 'admin', 
        status: 'active',
        password: '123456', 
        address: "Tashkent, Uzbekistan"
      },
    ];

    for (const user of users) {
      const existing = await db('users').where({ email: user.email }).first();
      if (existing) {
        console.log(`${user.role} already exists, skipping...`);
        continue;
      }
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      await db('users').insert(user);
      
      console.log(`${user.role} created successfully!`);
    }

  } catch (err) {
    console.error('Error creating default admins:', err);
  }
}

