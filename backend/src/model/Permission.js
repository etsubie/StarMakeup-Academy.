import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const permissionSchema = new Schema(
    {
      name: { type: String, required: true, unique: true },
      description: { type: String },
    },
    { timestamps: true }
  );
  const Permission = model('Permission', permissionSchema);

  export default Permission