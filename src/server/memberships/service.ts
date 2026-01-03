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
