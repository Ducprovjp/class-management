import mongoose, { Document, Schema, Types } from "mongoose";

export interface IStudent extends Document {
  _id: Types.ObjectId;
  name: string;
  dob?: string;
  gender?: string;
  current_grade?: number;
  parent_id: mongoose.Schema.Types.ObjectId;
  class_ids?: (mongoose.Schema.Types.ObjectId | string)[]; // Cho phép string hoặc ObjectId
}

const studentSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter student name"],
  },
  dob: {
    type: String,
  },
  gender: {
    type: String,
  },
  current_grade: {
    type: Number,
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
    required: [true, "Please provide parent ID"],
  },
  class_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      default: [],
    },
  ],
});

export default mongoose.model<IStudent>("Student", studentSchema);
