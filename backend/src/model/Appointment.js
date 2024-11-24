import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const appointmentSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    customer_name: {type: String},
    phone: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  },
  { timestamps: true }
);
 const Appointment = model('Appointment', appointmentSchema);

 export default Appointment