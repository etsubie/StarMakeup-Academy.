import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../model/User.js";
import Role from "../model/Role.js";
import Permission from "../model/Permission.js";
import UserPermission from "../model/UserPermission.js";

// Create a new User
export const createUser = async (req, res) => {
  const { name, email, password, roleName, permissionNames } = req.body;

  if (!email || !password || !roleName) {
    return res.status(400).json({ success: false, message: "Email, password, and role name are required" });
  }

  try {
    // Check if User with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Find the role by name
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ success: false, message: `Role '${roleName}' not found` });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role._id,
    });

    await newUser.save();

    // Assign permissions if provided
    if (permissionNames && permissionNames.length > 0) {
      const permissions = await Permission.find({ name: { $in: permissionNames } });
      if (permissions.length !== permissionNames.length) {
        return res.status(400).json({ success: false, message: "Some permissions in the list were not found" });
      }

      const userPermissionData = permissions.map((permission) => ({
        userId: newUser._id,
        permissionId: permission._id,
      }));

      await UserPermission.insertMany(userPermissionData);
    }

    return res.status(201).json({ success: true, message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating User:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all Users with their permissions, sorted from latest to oldest with pagination
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page is 1, limit is 10

    // Convert page and limit to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Calculate the skip value for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Get total number of users to calculate the total pages
    const totalUsers = await User.countDocuments();

    // Fetch users with pagination
    const users = await User.find()
      .populate("role") // Populate role details
      .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
      .skip(skip)
      .limit(limitNumber); // Apply limit for pagination

    return res.status(200).json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limitNumber), // Calculate total pages
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching Users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Get a single User by ID
export const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  try {
    const user = await User.findById(id).populate("role");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching User:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update a User
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, roleName, permissionNames } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  try {
    // Check if User exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updateData = {};

    // Update name if provided
    if (name) updateData.name = name;

    // Update email if provided
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== id) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
      updateData.email = email;
    }

    // Hash and update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Validate and update role if provided
    if (roleName) {
      const role = await Role.findOne({ name: roleName });
      if (!role) {
        return res.status(400).json({ success: false, message: `Role '${roleName}' not found` });
      }
      updateData.role = role._id;
    }

    // Validate and update permissions if provided
    if (permissionNames && permissionNames.length > 0) {
      const permissions = await Permission.find({ name: { $in: permissionNames } });
      if (permissions.length !== permissionNames.length) {
        return res.status(400).json({ success: false, message: "Some permissions not found" });
      }

      // Remove existing permissions
      await UserPermission.deleteMany({ userId: id });

      // Insert new permissions
      const userPermissionData = permissions.map((permission) => ({
        userId: id,
        permissionId: permission._id,
      }));
      await UserPermission.insertMany(userPermissionData);
    }

    // Update the user document
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).populate("role");

    return res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating User:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete a User
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting User:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
