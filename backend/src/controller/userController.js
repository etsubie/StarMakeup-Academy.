import bcrypt from "bcryptjs";
import User from "../model/User.js";
import Role from "../model/Role.js";
import Permission from "../model/Permission.js";

// Create a new User
export const createUser = async (req, res) => {
  try {
    const { name, email, password, roleName, permissionNames } = req.body;

    if (!email || !password || !roleName) {
      return res
        .status(400)
        .json({ message: "email, password, and role name are required" });
    }

    // Check if User with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Find the role ID based on roleName
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ message: `Role '${roleName}' not found` });
    }

    // Find permission IDs based on permissionNames (if provided)
    let permissions = [];
    if (permissionNames && permissionNames.length > 0) {
      permissions = await Permission.find({ name: { $in: permissionNames } });
      if (permissions.length !== permissionNames.length) {
        return res.status(400).json({ message: "Some permissions not found" });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User with role and permissions
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role._id,
      permissions: permissions.map(permission => permission._id),
    });

    await newUser.save();
    return res
      .status(201)
      .json({ message: "User created successfully", User: newUser });
  } catch (error) {
    console.error("Error creating User:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all Users with their permissions, sorted from latest to oldest
export const getUsers = async (req, res) => {
  try {
    const Users = await User.find()
      .populate("role") // Populate role details
      .sort({ createdAt: -1 }); // Sort by createdAt field in descending order
    return res.status(200).json(Users);
  } catch (error) {
    console.error("Error fetching Users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a User
export const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, password, roleName, permissionNames } = req.body;
  
      // Check if User exists
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const updateData = {};
  
      if (name) {
        updateData.name = name;
      }
  
      // Validate email
      if (email) {
        const existingemail = await User.findOne({ email });
        if (existingemail) {
          return res.status(400).json({ message: "Email already exists" });
        }
  
        updateData.email = email;
      }
  
      // Validate password and hash if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
  
      // Validate role if provided
      if (roleName) {
        const role = await Role.findOne({ name: roleName });
        if (!role) {
          return res
            .status(400)
            .json({ message: `Role '${roleName}' not found` });
        }
        updateData.role = role._id;
      }
  
      // Validate and update permissions if provided
      if (permissionNames && permissionNames.length > 0) {
        const permissions = await Permission.find({ name: { $in: permissionNames } });
        if (permissions.length !== permissionNames.length) {
          return res.status(400).json({ message: "Some permissions not found" });
        }
        updateData.permissions = permissions.map(permission => permission._id);
      }
  
      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      }).populate("role permissions");
  
      return res
        .status(200)
        .json({ message: "User updated successfully", User: updatedUser });
    } catch (error) {
      console.error("Error updating User:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
// Delete a User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting User:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
