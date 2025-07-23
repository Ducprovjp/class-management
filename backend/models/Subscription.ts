import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISubscription extends Document {
  _id: Types.ObjectId;
  student_id: mongoose.Schema.Types.ObjectId;
  package_name?: string;
  start_date?: string;
  end_date?: string;
  total_sessions?: number;
  used_sessions: number;
}

const subscriptionSchema: Schema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Please provide student ID'],
  },
  package_name: {
    type: String,
  },
  start_date: {
    type: String,
  },
  end_date: {
    type: String,
  },
  total_sessions: {
    type: Number,
  },
  used_sessions: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model<ISubscription>('Subscription', subscriptionSchema);