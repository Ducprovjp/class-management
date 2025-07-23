export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Parent {
  _id: string;
  name: string;
  phone?: string;
  email: string;
}

export interface Student {
  _id: string;
  name: string;
  dob?: string;
  gender?: string;
  current_grade?: number;
  parent_id: Parent;
}

export interface Class {
  _id: string;
  name: string;
  subject?: string;
  day_of_week?: string;
  time_start?: string;
  time_end?: string;
  teacher_name?: string;
  max_students?: number;
}

export interface ClassRegistration {
  _id: string;
  class_id: string;
  student_id: string;
}

export interface Subscription {
  _id: string;
  student_id: string;
  package_name?: string;
  start_date?: string;
  end_date?: string;
  total_sessions?: number;
  used_sessions: number;
}
