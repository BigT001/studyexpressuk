import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import { SiteContent } from '@/server/db/models/siteContent.model';

// GET: Fetch content by key
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        await connectToDatabase();

        const content = await SiteContent.findOne({ key });

        if (!content) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }

        return NextResponse.json(content);
    } catch (error) {
        console.error('Error fetching site content:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT: Update content (Admin only)
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            key, title, content, imageUrl,
            tagline, introduction,
            missionTitle, missionContent, missionImageUrl,
            features,
            heroDescription, introTitle,
            ctaTitle, ctaDescription, ctaButtonText,
            featuresTitle, featuresTagline, stats
        } = body;

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        await connectToDatabase();

        const updatedContent = await SiteContent.findOneAndUpdate(
            { key },
            {
                title,
                content,
                imageUrl,
                tagline,
                introduction,
                missionTitle,
                missionContent,
                missionImageUrl,
                features,
                heroDescription,
                introTitle,
                ctaTitle,
                ctaDescription,
                ctaButtonText,
                featuresTitle,
                featuresTagline,
                stats,
                lastUpdatedBy: session.user.id
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Revalidate the about page to ensure live updates
        revalidatePath('/about');
        revalidatePath('/');

        return NextResponse.json(updatedContent);
    } catch (error) {
        console.error('Error updating site content:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
