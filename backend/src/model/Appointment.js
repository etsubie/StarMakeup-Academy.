import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const appointmentSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    service: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  },
  { timestamps: true }
);
 const Appointment = model('Appointment', appointmentSchema);

 export default Appointment