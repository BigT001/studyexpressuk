import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import User from '@/server/db/models/user.model';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    // Fetch all fields from user - no select() to get everything
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Convert to plain object to ensure all fields are accessible
    const userObj = user.toObject ? user.toObject() : { ...user };

    console.log('[Profile API] User data from DB:', {
      email: userObj.email,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      phone: userObj.phone,
      bio: userObj.bio,
      profileImage: userObj.profileImage,
    });

    const responseData = {
      firstName: userObj.firstName || '',
      lastName: userObj.lastName || '',
      email: userObj.email,
      phone: userObj.phone || '',
      dob: userObj.dob ? new Date(userObj.dob).toISOString().split('T')[0] : '',
      bio: userObj.bio || '',
      interests: userObj.interests || '',
      qualifications: userObj.qualifications || '',
      profileImage: userObj.profileImage || '',
    };

    console.log('[Profile API] Sending response:', responseData);

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, phone, dob, bio, interests, qualifications, profileImage } = body;

    console.log('Profile PATCH request from:', session.user.email);
    console.log('Update data received:', { firstName, lastName, phone, dob, bio, interests, qualifications, profileImage: profileImage ? 'URL provided' : 'none' });

    // Validation
    if (firstName && firstName.length < 2) {
      return NextResponse.json({ error: 'First name must be at least 2 characters' }, { status: 400 });
    }
    if (lastName && lastName.length < 2) {
      return NextResponse.json({ error: 'Last name must be at least 2 characters' }, { status: 400 });
    }
    if (phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Build update object with only non-empty values
    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (dob) updateData.dob = new Date(dob);
    if (bio) updateData.bio = bio;
    if (interests) updateData.interests = interests;
    if (qualifications) updateData.qualifications = qualifications;
    if (profileImage) updateData.profileImage = profileImage;
    
    console.log('Update object to be applied:', updateData);
    
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User updated successfully:', { email: user.email, firstName: user.firstName, lastName: user.lastName });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        phone: user.phone || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        bio: user.bio || '',
        interests: user.interests || '',
        qualifications: user.qualifications || '',
        profileImage: user.profileImage || '',
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
