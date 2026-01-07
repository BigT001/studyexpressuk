import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import IndividualProfileModel from '@/server/db/models/individualProfile.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';

export async function GET(req: Request) {
  try {
    const session: any = await getServerAuthSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ email: session.user.email }).lean();
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    let profile = null;
    if (user.role === 'INDIVIDUAL') {
      profile = await IndividualProfileModel.findOne({ userId: user._id }).lean();
    } else if (user.role === 'CORPORATE') {
      profile = await CorporateProfileModel.findOne({ ownerId: user._id }).lean();
    }

    // Only use firstName/lastName from profile if they exist (individual profile)
    let firstName = user.firstName || '';
    let lastName = user.lastName || '';
    if (profile && 'firstName' in profile && typeof profile.firstName === 'string') {
      firstName = profile.firstName;
    }
    if (profile && 'lastName' in profile && typeof profile.lastName === 'string') {
      lastName = profile.lastName;
    }
    // Use user.location if present, otherwise use profile.address for corporate
    let location = '';
    if ('location' in user && typeof user.location === 'string') {
      location = user.location;
    } else if (profile && 'address' in profile && typeof profile.address === 'string') {
      location = profile.address;
    }
    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        phone: user.phone || '',
        firstName,
        lastName,
        location,
        dob: user.dob || (profile && 'dob' in profile ? profile.dob : ''),
        bio: user.bio || (profile && 'bio' in profile ? profile.bio : ''),
        interests: user.interests || (profile && 'interests' in profile ? profile.interests : ''),
        qualifications: user.qualifications || (profile && 'qualifications' in profile ? profile.qualifications : ''),
        profileImage: user.profileImage || (profile && 'avatar' in profile ? profile.avatar : ''),
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to fetch user profile' }, { status: 500 });
  }
}
