import { describe, it, expect, beforeAll } from 'vitest';
import setup from '../integration/setup';
import { createUser } from '../../src/server/users/service';
import { purchaseMembership } from '../../src/server/memberships/service';
import MembershipModel from '../../src/server/db/models/membership.model';
import PaymentModel from '../../src/server/db/models/payment.model';

beforeAll(async () => {
  await setup();
}, 30000); // Increase timeout for MongoDB setup

describe('Memberships Service (integration)', () => {
  it('purchases membership transactionally', async () => {
    const user = await createUser({ email: `pay${Date.now()}@example.com`, password: 'password123' });
    const result = await purchaseMembership({ subjectType: 'USER', subjectId: user._id.toString(), planId: 'basic', amount: 1000, currency: 'usd' });
    expect(result).toBeTruthy();
    const payment = await PaymentModel.findById(result.payment._id).lean();
    expect(payment).toBeTruthy();
    expect(payment.status).toBe('succeeded');
    const membership = await MembershipModel.findOne({ subjectId: user._id }).lean();
    expect(membership).toBeTruthy();
    expect(membership.status).toBe('active');
  });
});
