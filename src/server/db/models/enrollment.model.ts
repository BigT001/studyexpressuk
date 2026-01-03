import mongoose, { Schema, Document } from 'mongoose';

export type EnrollmentStatus = 'enrolled' | 'in_progress' | 'completed' | 'cancelled';

export interface IEnrollment extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId; // event or course
  progress?: number; // 0-100
  status: EnrollmentStatus;
  completionDate?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    progress: { type: Number, default: 0 },
    status: { type: String, enum: ['enrolled', 'in_progress', 'completed', 'cancelled'], default: 'enrolled' },
    completionDate: { type: Date },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const EnrollmentModel = (mongoose.models.Enrollment as mongoose.Model<IEnrollment>) || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
export default EnrollmentModel;
