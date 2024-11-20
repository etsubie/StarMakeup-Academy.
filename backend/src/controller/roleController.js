import Role from "../model/Role.js";
import mongoose from "mongoose";

// Get all roles with pagination
export const getAllRoles = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const roles = await Role.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    return res.status(200).json({ success: true, data: roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return res.status(500).json({ success: false, message: 'Error fetching roles' });
  }
};

// Get a single role by ID
export const getRole = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  try {
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    return res.status(200).json({ success: true, data: role });
  } catch (error) {
    console.error('Error fetching role:', error);
    return res.status(500).json({ success: false, message: 'Error fetching role' });
  }
};

// Create a new role
export const createRole = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Role name is required' });
  }

  try {
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ success: false, message: 'Role name already exists' });
    }

    const newRole = await new Role({ name }).save();
    return res.status(201).json({ success: true, data: newRole });
  } catch (error) {
    console.error('Error creating role:', error);
    return res.status(500).json({ success: false, message: 'Error creating role' });
  }
};

// Update an existing role
export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  if (!name) {
    return res.status(400).json({ success: false, message: 'Role name is required' });
  }

  try {
    const updatedRole = await Role.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedRole) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    return res.status(200).json({ success: true, data: updatedRole });
  } catch (error) {
    console.error('Error updating role:', error);
    return res.status(500).json({ success: false, message: 'Error updating role' });
  }
};

// Delete a role
export const deleteRole = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  try {
    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    return res.status(200).json({ success: true, message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    return res.status(500).json({ success: false, message: 'Error deleting role' });
  }
};
