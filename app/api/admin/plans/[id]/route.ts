import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import * as planService from '@/server/plans/service';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerAuthSession();
        if (!session || !['ADMIN', 'SUBADMIN'].includes(session.user?.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const updatedPlan = await planService.updatePlan(id, body);

        if (!updatedPlan) {
            return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        }

        return NextResponse.json(updatedPlan);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerAuthSession();
        if (!session || !['ADMIN', 'SUBADMIN'].includes(session.user?.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const deletedPlan = await planService.deletePlan(id);

        if (!deletedPlan) {
            return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
