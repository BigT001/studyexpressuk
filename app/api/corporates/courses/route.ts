import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import CourseModel from '@/server/db/models/course.model';

export async function GET() {
  try {
    const session = await getServerAuthSession();
    console.log('Session user ID:', session?.user?.id, 'Role:', session?.user?.role);
    
    if (!session || session.user?.role !== 'CORPORATE') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const corporate = await CorporateProfileModel.findOne({ ownerId: session.user.id })
      .populate('registeredCourses');
    
    if (!corporate) {
      console.error('Corporate profile not found for ownerId:', session.user.id);
      return NextResponse.json({ error: 'Corporate profile not found' }, { status: 404 });
    }

    console.log('Corporate found:', corporate._id, 'Registered courses:', corporate.registeredCourses);

    // Initialize registeredCourses if it doesn't exist (for existing documents)
    if (!corporate.registeredCourses) {
      console.log('Initializing registeredCourses array');
      corporate.registeredCourses = [];
      await corporate.save();
    }

    const courses = corporate.registeredCourses || [];
    console.log('Returning courses:', courses.length, 'courses');

    return NextResponse.json({ 
      success: true, 
      registeredCourses: courses
    });
  } catch (error) {
    console.error('Error fetching registered courses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    
    if (!session || session.user?.role !== 'CORPORATE') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const corporate = await CorporateProfileModel.findOne({ ownerId: session.user.id });
    if (!corporate) {
      return NextResponse.json({ error: 'Corporate profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { courseIds } = body;
    
    console.log('POST /api/corporates/courses - Adding courseIds:', courseIds);

    if (!courseIds || !Array.isArray(courseIds)) {
      return NextResponse.json({ error: 'Course IDs array is required' }, { status: 400 });
    }

    // Verify courses exist
    const courses = await CourseModel.find({ _id: { $in: courseIds } });
    console.log('Found', courses.length, 'out of', courseIds.length, 'requested courses');
    
    if (courses.length !== courseIds.length) {
      return NextResponse.json({ error: 'Some courses not found' }, { status: 404 });
    }

    // Add courses to corporate's registered courses (avoid duplicates)
    const currentCourses = corporate.registeredCourses || [];
    const newCourses = courseIds.filter((id: string) => 
      !currentCourses.some(existing => existing.toString() === id)
    );
    
    console.log('Adding', newCourses.length, 'new courses');
    corporate.registeredCourses = [...currentCourses, ...newCourses];
    const savedCorporate = await corporate.save();
    
    console.log('Corporate saved. Registered courses:', savedCorporate.registeredCourses);

    return NextResponse.json({ 
      success: true, 
      registeredCourses: savedCorporate.registeredCourses 
    });
  } catch (error) {
    console.error('Error registering courses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    
    if (!session || session.user?.role !== 'CORPORATE') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const corporate = await CorporateProfileModel.findOne({ ownerId: session.user.id });
    if (!corporate) {
      return NextResponse.json({ error: 'Corporate profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Remove course from registered courses
    corporate.registeredCourses = (corporate.registeredCourses || []).filter(
      id => id.toString() !== courseId
    );
    await corporate.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unregistering course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
