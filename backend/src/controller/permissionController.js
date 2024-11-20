import Permission from "../model/Permission.js";
import User from "../model/User.js";

// Create a new permission
export const createPermission = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Permission name is required" });
    }

    const existingPermission = await Permission.findOne({ name });
    if (existingPermission) {
      return res.status(400).json({ message: "Permission already exists" });
    }

    const newPermission = new Permission({ name });
    await newPermission.save();

    return res.status(201).json({ message: "Permission created successfully", permission: newPermission });
  } catch (error) {
    console.error("Error creating permission:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all permissions
export const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ createdAt: -1 }); // Sort by createdAt field in descending order
    return res.status(200).json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a permission
export const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Permission name is required" });
    }

    const updatedPermission = await Permission.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedPermission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    return res.status(200).json({ message: "Permission updated successfully", permission: updatedPermission });
  } catch (error) {
    console.error("Error updating permission:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a permission
export const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPermission = await Permission.findByIdAndDelete(id);
    if (!deletedPermission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    return res.status(200).json({ message: "Permission deleted successfully" });
  } catch (error) {
    console.error("Error deleting permission:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

  
  
