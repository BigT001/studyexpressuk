
import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteContent extends Document {
    key: string; // e.g., 'about-us', 'terms-conditions'
    title: string;
    content: string; // Generic content fallback
    imageUrl?: string; // Hero image URL
    tagline?: string; // e.g., 'Our Story'
    introduction?: string;
    missionTitle?: string;
    missionContent?: string;
    missionImageUrl?: string;
    heroDescription?: string;
    introTitle?: string;
    ctaTitle?: string;
    ctaDescription?: string;
    ctaButtonText?: string;
    featuresTitle?: string;
    featuresTagline?: string;
    stats?: Array<{
        value: string;
        label: string;
        color: string;
    }>;
    features?: Array<{
        icon: string;
        title: string;
        description: string;
        badge?: string;
    }>;
    lastUpdatedBy: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContent>(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },
        title: {
            type: String,
            required: false // Relaxed
        },
        content: {
            type: String,
            required: false // Relaxed
        },
        imageUrl: {
            type: String,
            required: false
        },
        tagline: { type: String },
        introduction: { type: String },
        missionTitle: { type: String },
        missionContent: { type: String },
        missionImageUrl: { type: String },
        heroDescription: { type: String },
        introTitle: { type: String },
        ctaTitle: { type: String },
        ctaDescription: { type: String },
        ctaButtonText: { type: String },
        featuresTitle: { type: String },
        featuresTagline: { type: String },
        stats: [{
            value: { type: String },
            label: { type: String },
            color: { type: String }
        }],
        features: [{
            icon: { type: String },
            title: { type: String },
            description: { type: String },
            badge: { type: String }
        }],
        lastUpdatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true,
    }
);

export const SiteContent = mongoose.models.SiteContent || mongoose.model<ISiteContent>('SiteContent', SiteContentSchema);
