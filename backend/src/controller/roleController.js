import Role from "../model/Role.js";

// Get all roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    return res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return res.status(500).json({ message: 'Error fetching roles' });
  }
};

export const getRole = async (req, res) => {
  try {
    const {id} = req.params
    const role = await Role.findById(id);
    return res.status(200).json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    return res.status(500).json({ message: 'Error fetching role' });
  }
};

// Create a new role
export const createRole = async (req, res) => {
  const { name } = req.body;

  try {
    const newRole = new Role({ name });
    await newRole.save();
    return res.status(201).json(newRole);
  } catch (error) {
    console.error('Error creating role:', error);
    return res.status(500).json({ message: 'Error creating role' });
  }
};

// Update an existing role
export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedRole = await Role.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }
    return res.status(200).json(updatedRole);
  } catch (error) {
    console.error('Error updating role:', error);
    return res.status(500).json({ message: 'Error updating role' });
  }
};

// Delete a role
export const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }
    return res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    return res.status(500).json({ message: 'Error deleting role' });
  }
};
