import { connectToDatabase } from '../db/mongoose';
import MembershipModel from '../db/models/membership.model';
import PaymentModel from '../db/models/payment.model';
import mongoose from 'mongoose';

/**
 * Purchase membership: create a payment record and activate membership in a transaction
 */
export async function purchaseMembership({ subjectType, subjectId, planId, amount, currency = 'usd' }: { subjectType: 'USER' | 'CORPORATE'; subjectId: string; planId: string; amount: number; currency?: string; }) {
  await connectToDatabase();
  const session = await mongoose.startSession();
  try {
    let result: any = null;
    await session.withTransaction(async () => {
      const payment = await PaymentModel.create([{ subjectType, subjectId: new mongoose.Types.ObjectId(subjectId), amount, currency, status: 'pending', metadata: { planId } }], { session });
      // upsert membership
      const membership = await MembershipModel.findOneAndUpdate(
        { subjectType, subjectId: new mongoose.Types.ObjectId(subjectId), planId },
        { $set: { status: 'active', startDate: new Date(), endDate: null, metadata: {} } },
        { upsert: true, new: true, session }
      );
      // mark payment succeeded for demo (in reality, wait for Stripe webhook)
      await PaymentModel.findByIdAndUpdate(payment[0]._id, { status: 'succeeded' }, { session });
      result = { payment: payment[0], membership };
    });
    return result;
  } finally {
    await session.endSession();
  }
}

/**
 * Checks all active memberships. If the endDate has passed,
 * updates their status from 'active' to 'expired' and cuts off access.
 */
export async function processMembershipExpirations() {
  await connectToDatabase();
  const now = new Date();
  
  try {
    const result = await MembershipModel.updateMany(
      { 
        status: 'active',
        endDate: { $lt: now } // If endDate is less than now, it has expired
      },
      { 
        $set: { status: 'expired' } 
      }
    );
    
    console.log(`Processed Expirations: ${result.modifiedCount} memberships cut off.`);
    return result.modifiedCount;
  } catch (error) {
    console.error('Failed to process membership expirations:', error);
    throw error;
  }
}

/**
 * Creates a system that gives users a 1-week notification ahead of their due date.
 * Finds any active memberships whose endDate is exactly within the next 7 days,
 * and who haven't already received a '7_day_notice'.
 */
export async function processMembershipNotifications() {
  await connectToDatabase();
  const now = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(now.getDate() + 7);

  try {
    // Requires User & Message models for fetching an admin sender
    const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}));
    const adminUser = await UserModel.findOne({ role: 'ADMIN' }).select('_id');
    
    if (!adminUser) {
      console.log('Cannot send 1-week notice: No ADMIN user found to act as sender.');
      return 0;
    }

    // Find memberships ending within exactly 7 days, that have not yet had to notice
    // `metadata.notified_7_day` handles single trigger tracking
    const approachingExpirations = await MembershipModel.find({
      status: 'active',
      endDate: { $gt: now, $lte: sevenDaysFromNow },
      $or: [
        { 'metadata.notified_7_day': { $exists: false } },
        { 'metadata.notified_7_day': false }
      ]
    });

    if (approachingExpirations.length === 0) return 0;

    let notificationsSent = 0;
    const MessageModel = mongoose.models.Message || mongoose.model('Message', new mongoose.Schema({}));

    for (const membership of approachingExpirations) {
      // Create a direct warning message mapping the 1-week due date
      const daysLeft = Math.ceil((new Date(membership.endDate!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      const content = `Urgent: Your active subscription plan is ending in ${daysLeft} days. Please ensure you manually renew or check your billing information to prevent data cutoff and access suspension.`;

      await MessageModel.create({
        senderId: adminUser._id,
        recipientId: membership.subjectId,
        content: content,
        metadata: { type: 'system_alert', urgency: 'high', reference: 'membership_renewal' }
      });

      // Update the membership metadata payload safely so it doesn't trigger repeatedly every minute/hour
      await MembershipModel.findByIdAndUpdate(membership._id, {
        $set: {
          'metadata.notified_7_day': true
        }
      });
      console.log(`Sent 1-week notice to Subject ID: ${membership.subjectId}`);
      notificationsSent++;
    }

    return notificationsSent;
  } catch (error) {
    console.error('Failed to process 1-week warnings:', error);
    throw error;
  }
}
