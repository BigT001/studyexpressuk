import mongoose, { Schema, Document } from 'mongoose';

export interface IIndividualProfile extends Document {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  dob?: Date;
  bio?: string;
  avatar?: string; // Cloudinary URL
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const IndividualProfileSchema = new Schema<IIndividualProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date },
    bio: { type: String },
    avatar: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const IndividualProfileModel =
  (mongoose.models.IndividualProfile as mongoose.Model<IIndividualProfile>) ||
  mongoose.model<IIndividualProfile>('IndividualProfile', IndividualProfileSchema);

export default IndividualProfileModel;
