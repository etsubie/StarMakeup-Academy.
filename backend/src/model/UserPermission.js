import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const UserPermissionSchema = new Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    permission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permission',
      required: true,
    },
  }, { timestamps: true });
  
const UserPermission  = model('UserPermission', UserPermissionSchema);