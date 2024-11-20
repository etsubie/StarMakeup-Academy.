import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dbConnect from '../config/dbConnect.js';
import Role from '../model/Role.js';

dotenv.config();

// Define and Seed Roles
const seedRoles = async () => {
  await dbConnect();

  try {
    // Define the roles you want to seed
    const roles = [
      { name: 'Manager' },
      { name: 'Coordinator' },
      { name: 'Customer' },
      { name: 'Student' },
      { name: 'Registar' },
      { name: 'Instructor' },

    ];

    // Delete existing roles
    await Role.deleteMany({});

    // Insert roles
    const roleDocs = await Role.insertMany(roles);
    console.log('Roles seeded:', roleDocs);
  } catch (error) {
    console.error('Error seeding roles:', error);
  } finally {
    mongoose.connection.close(); 
  }
};

seedRoles(); 
