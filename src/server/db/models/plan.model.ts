import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
    name: string;
    type: 'individual' | 'corporate';
    price: number;
    currency: string;
    billingInterval: 'one-time' | 'month' | 'year';
    description: string;
    features: string[];
    active: boolean;
    courseDiscount?: number;
    eventDiscount?: number;
    createdAt: Date;
    updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>(
    {
        name: { type: String, required: true },
        type: { type: String, enum: ['individual', 'corporate'], required: true },
        price: { type: Number, required: true },
        currency: { type: String, default: 'USD' },
        billingInterval: { type: String, enum: ['one-time', 'month', 'year'], default: 'one-time' },
        description: { type: String, default: '' },
        features: { type: [String], default: [] },
        active: { type: Boolean, default: true },
        courseDiscount: { type: Number, default: 0, min: 0, max: 100 },
        eventDiscount: { type: Number, default: 0, min: 0, max: 100 },
    },
    { timestamps: true }
);

const PlanModel = (mongoose.models.Plan as mongoose.Model<IPlan>) || mongoose.model<IPlan>('Plan', PlanSchema);

export default PlanModel;
