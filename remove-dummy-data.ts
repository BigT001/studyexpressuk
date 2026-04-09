import mongoose, { Schema } from 'mongoose';

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?retryWrites=true&w=majority&serverSelectionTimeoutMS=5000";

const PlanSchema = new Schema(
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

const PlanModel = mongoose.models.Plan || mongoose.model('Plan', PlanSchema);

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    // Delete all dummy corporate plans (or all corporate plans to start fresh)
    const deleteResult = await PlanModel.deleteMany({ type: 'corporate' });
    console.log(`Deleted ${deleteResult.deletedCount} corporate plans.`);

    // Create professional plans
    const plans = [
      {
        name: 'Starter Team',
        type: 'corporate',
        price: 299,
        currency: 'USD',
        billingInterval: 'year',
        description: 'Ideal for small teams looking to skill up.',
        features: ['Up to 10 team members', 'Basic course access', 'Email support', 'Team analytics dashboard'],
        active: true,
        courseDiscount: 10,
      },
      {
        name: 'Professional Team',
        type: 'corporate',
        price: 999,
        currency: 'USD',
        billingInterval: 'year',
        description: 'Comprehensive training for growing organizations.',
        features: ['Up to 50 team members', 'Full course catalog access', 'Priority support', 'Advanced team analytics', 'Learning paths'],
        active: true,
        courseDiscount: 20,
      },
      {
        name: 'Enterprise',
        type: 'corporate',
        price: 2499,
        currency: 'USD',
        billingInterval: 'year',
        description: 'Customized learning solutions for large enterprises.',
        features: ['Unlimited team members', 'Full course catalog access', 'Dedicated account manager', 'Custom learning paths', 'API access'],
        active: true,
        courseDiscount: 35,
      }
    ];

    for (const p of plans) {
      await PlanModel.create(p);
    }
    console.log('Created professional corporate plans.');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

run();
