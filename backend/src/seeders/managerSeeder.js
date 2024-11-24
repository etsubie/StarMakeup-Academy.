import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dbConnect from '../config/dbConnect.js';
import User from '../model/User.js';
import Role from '../model/Role.js';

dotenv.config();
dbConnect();

const createManager = async () => {
  try {
    // Ensure Manager role exists
    let managerRole = await Role.findOne({ name: 'Manager' });
    if (!managerRole) {
      console.log("Manager role not found");
    }

    const managerData = {
      name: 'Attna',
      email: 'manager@email.com',
      role: managerRole._id, 
      manager: {
      },
      password: await bcrypt.hash('1234', 10), // Hashing password
    };

    // Find and update or create the Manager
    const manager = await User.findOneAndUpdate(
      { email: managerData.email }, // Query by email
      managerData, // Update data
      { new: true, upsert: true } // Options to return updated/created document
    ).populate('role'); // Populate the role field

    console.log(
      manager.wasNew ? "Manager created successfully" : "Manager updated successfully"
    );
    console.log('Manager:', manager); // Log manager to verify role is assigned

  } catch (error) {
    console.error("Error in updating or creating Manager:", error);
  } finally {
    // Close the connection after operations are done
    mongoose.connection.close();
  }
};

createManager();
