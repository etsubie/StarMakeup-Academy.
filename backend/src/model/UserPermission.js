import mongoose from 'mongoose';
import User from './User.js';
import Permission from './Permission.js';

const { Schema, model } = mongoose;

const UserPermissionSchema = new Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    permissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
  }, { timestamps: true });
  
const UserPermission  = model('UserPermission', UserPermissionSchema);

export default UserPermission