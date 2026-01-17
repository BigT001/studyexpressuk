import { NextResponse, NextRequest } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import CorporateProfileModel from '@/server/db/models/corporate.model';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const profile = await CorporateProfileModel.findOne({ ownerId: session.user.id }).lean();

    if (!profile) {
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error('Error fetching corporate profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    await connectToDatabase();

    // Find and update the corporate profile
    const profile = await CorporateProfileModel.findOneAndUpdate(
      { ownerId: session.user.id },
      {
        companyName: body.companyName,
        industry: body.industry,
        employeeCount: body.employeeCount,
        website: body.website,
        address: body.address,
        registrationNumber: body.registrationNumber,
        taxId: body.taxId,
        logo: body.logo,
        contactPerson: body.contactPerson,
        bio: body.bio,
      },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json(
      { 
        success: true, 
        profile,
        message: 'Profile updated successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating corporate profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
