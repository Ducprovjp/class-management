import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IClassRegistration extends Document {
  _id: Types.ObjectId;
  class_id: mongoose.Schema.Types.ObjectId;
  student_id: mongoose.Schema.Types.ObjectId;
}

const classRegistrationSchema: Schema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Please provide class ID'],
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Please provide student ID'],
  },
});

export default mongoose.model<IClassRegistration>('ClassRegistration', classRegistrationSchema);