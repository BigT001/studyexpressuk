import { NextResponse } from 'next/server';
import { purchaseMembershipSchema } from '@/shared/validators/membership.validator';
import * as membershipService from '@/server/memberships/service';
import { getServerAuthSession } from '@/server/auth/session';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = purchaseMembershipSchema.parse(body);
    const session: any = await getServerAuthSession(req);
    if (!session || (session.user.role !== 'INDIVIDUAL' && session.user.role !== 'CORPORATE')) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    const result = await membershipService.purchaseMembership({ subjectType: parsed.subjectType, subjectId: parsed.subjectId, planId: parsed.planId, amount: parsed.amount, currency: parsed.currency });
    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 400 });
  }
}
