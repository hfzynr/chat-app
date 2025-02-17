import { config } from 'dotenv';
import { connectDb } from '../lib/db.js';
import User from '../models/user.model.js';

config();

const seedUsers = [
  {
    email: 'himeko@email.com',
    fullName: 'Himeko',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portrais/woman1.jpg',
  },
  {
    email: 'fugue@email.com',
    fullName: 'Fugue',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portrais/woman2.jpg',
  },
  {
    email: 'acheron@email.com',
    fullName: 'Acheron',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portrais/woman3.jpg',
  },
  {
    email: 'herta@email.com',
    fullName: 'Herta',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portrais/woman4.jpg',
  },
];

const seedDatabase = async () => {
  try {
    await connectDb();

    await User.insertMany(seedUsers);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

seedDatabase();