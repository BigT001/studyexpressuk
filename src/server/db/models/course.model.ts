import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number; // in hours
  price?: number;
  instructor?: string;
  status: 'draft' | 'published' | 'active' | 'archived';
  imageUrl?: string;
  enrolledCount?: number;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    duration: {
      type: Number, // in hours
    },
    price: {
      type: Number,
    },
    instructor: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'active', 'archived'],
      default: 'draft',
    },
    imageUrl: {
      type: String,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const CourseModel = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default CourseModel;
