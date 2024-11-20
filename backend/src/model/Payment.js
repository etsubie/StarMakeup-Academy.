import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const paymentSchema = new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      amount: { type: Number, required: true },
      paymentMethod: { type: String, required: true },
      status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
      transactionId: { type: String },
    },
    { timestamps: true }
  );
   const Payment = model('Payment', paymentSchema);
   export default Payment