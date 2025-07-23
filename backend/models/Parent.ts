import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IParent extends Document {
  _id: Types.ObjectId;
  name: string;
  phone?: string;
  email: string;
}

const parentSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter parent name'],
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Please enter parent email'],
    unique: true,
  },
});

export default mongoose.model<IParent>('Parent', parentSchema);