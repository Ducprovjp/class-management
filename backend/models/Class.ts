import mongoose, { Document, Schema, Types } from "mongoose";

export interface IClass extends Document {
  _id: Types.ObjectId;
  name: string;
  subject?: string;
  day_of_week?: string;
  time_start?: string; // HH:mm
  time_end?: string; // HH:mm
  teacher_name?: string;
  max_students?: number;
}

const classSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter class name"],
  },
  subject: {
    type: String,
  },
  day_of_week: {
    type: String,
  },
  time_start: {
    type: String,
    required: [true, "Please enter start time"],
  },
  time_end: {
    type: String,
    required: [true, "Please enter end time"],
  },
  teacher_name: {
    type: String,
  },
  max_students: {
    type: Number,
  },
});

export default mongoose.model<IClass>("Class", classSchema);
