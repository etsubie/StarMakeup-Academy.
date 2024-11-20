import mongoose from "mongoose";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";

dotenv.config();

const dropDatabaseAndRecreateModels = async () => {
  try {
    // Connect to the database
    await dbConnect();
    console.log("Connected to the database");

    // Drop the entire database
    await mongoose.connection.db.dropDatabase();
    console.log("Database dropped successfully");

    // Reconnect to refresh models
    await dbConnect();
    console.log("Database reconnected, and models refreshed");

    // Exit process
    process.exit(0);
  } catch (error) {
    console.error("Error refreshing the database:", error);
    process.exit(1);
  }
};

// Run the function
dropDatabaseAndRecreateModels();
