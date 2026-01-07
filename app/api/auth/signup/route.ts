import { NextResponse } from 'next/server';
import { createUserSchema } from '@/shared/validators/user.validator';
import { createUser } from '@/server/users/service';
import IndividualProfileModel from '@/server/db/models/individualProfile.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import { connectToDatabase } from '@/server/db/mongoose';
import { ZodError } from 'zod';
import { UserRole } from '@/server/db/models/user.model';

interface CreateUserResponse {
  email: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  role?: any;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Extract name fields if provided
    const { firstName = '', lastName = '', ...rest } = body;
    
    const parsed = createUserSchema.parse({
      email: rest.email,
      password: rest.password,
      phone: rest.phone,
      role: rest.role,
    });

    await connectToDatabase();
    const user = await createUser({ 
      email: parsed.email, 
      password: parsed.password, 
      phone: parsed.phone, 
      role: parsed.role as unknown as UserRole,
      firstName: firstName || '',
      lastName: lastName || '',
    });

    const typedUser = user as CreateUserResponse;

    // Create individual profile if user is INDIVIDUAL
    if (typedUser.role === 'INDIVIDUAL' && typedUser._id) {
      await IndividualProfileModel.create({
        userId: typedUser._id,
        firstName: firstName || '',
        lastName: lastName || '',
      });
    }

    // Create corporate profile if user is CORPORATE
    if (typedUser.role === 'CORPORATE' && typedUser._id) {
      await CorporateProfileModel.create({
        userId: typedUser._id,
        companyName: firstName || '',
        contactPerson: lastName || '',
        email: rest.email,
      });
    }

    return NextResponse.json(
      { 
        success: true, 
        user: { 
          id: typedUser._id, 
          email: user.email, 
          role: typedUser.role,
          message: 'Account created successfully. Please sign in.'
        } 
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const error = err as Error & { errors?: unknown };
    console.error('Signup error:', error);
    
    // Handle database connection errors
    if (error.message?.includes('MongoDB connection') || error.message?.includes('timeout')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database service is currently unavailable. Please try again in a few moments.' 
        }, 
        { status: 503 }
      );
    }
    
    // Handle validation errors
    if (error.errors) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.errors 
        }, 
        { status: 400 }
      );
    }
    
    // Handle duplicate email
    if (error.message?.includes('already in use')) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' }, 
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create account' }, 
      { status: 400 }
    );
  }
}

