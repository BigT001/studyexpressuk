import mongoose, { Schema, Document } from 'mongoose';

interface ISettings extends Document {
  type: string;
  settings: {
    // Registration
    allowIndividualRegistration: boolean;
    allowCorporateRegistration: boolean;
    requireEmailVerification: boolean;
    
    // Security
    enforce2FAForAdmins: boolean;
    passwordExpiryDays: number;
    sessionTimeoutMinutes: number;
    maxLoginAttempts: number;
    
    // Email
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    emailFromName: string;
    emailFromAddress: string;
    
    // Payment
    stripeEnabled: boolean;
    taxRate: number;
    
    // System
    maintenanceMode: boolean;
    maintenanceMessage: string;
    
    // Features
    enableMessaging: boolean;
    enableAnalytics: boolean;
    enableCertificates: boolean;
    enableEventNotifications: boolean;
  };
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>({
  type: {
    type: String,
    enum: ['system'],
    default: 'system',
    unique: true,
  },
  settings: {
    // Registration Settings
    allowIndividualRegistration: {
      type: Boolean,
      default: true,
    },
    allowCorporateRegistration: {
      type: Boolean,
      default: true,
    },
    requireEmailVerification: {
      type: Boolean,
      default: true,
    },
    
    // Security Rules
    enforce2FAForAdmins: {
      type: Boolean,
      default: true,
    },
    passwordExpiryDays: {
      type: Number,
      default: 90,
      min: 0,
    },
    sessionTimeoutMinutes: {
      type: Number,
      default: 60,
      min: 5,
    },
    maxLoginAttempts: {
      type: Number,
      default: 5,
      min: 1,
    },
    
    // Email Configuration
    smtpHost: {
      type: String,
      default: 'smtp.gmail.com',
    },
    smtpPort: {
      type: Number,
      default: 587,
      min: 1,
      max: 65535,
    },
    smtpUsername: {
      type: String,
      default: 'noreply@studyexpressuk.com',
    },
    emailFromName: {
      type: String,
      default: 'Study Express UK',
    },
    emailFromAddress: {
      type: String,
      default: 'noreply@studyexpressuk.com',
    },
    
    // Payment & Billing
    stripeEnabled: {
      type: Boolean,
      default: true,
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    
    // System Maintenance
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    maintenanceMessage: {
      type: String,
      default: '',
    },
    
    // Feature Toggles
    enableMessaging: {
      type: Boolean,
      default: true,
    },
    enableAnalytics: {
      type: Boolean,
      default: true,
    },
    enableCertificates: {
      type: Boolean,
      default: true,
    },
    enableEventNotifications: {
      type: Boolean,
      default: true,
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Create index for faster lookups
settingsSchema.index({ type: 1 });

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', settingsSchema);
