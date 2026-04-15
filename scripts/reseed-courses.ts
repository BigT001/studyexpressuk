import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in environment');
  process.exit(1);
}

// Define Schema inside script to avoid import issues with compiled models
const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    duration: Number,
    price: Number,
    instructor: String,
    status: { type: String, enum: ['draft', 'published', 'active', 'archived'], default: 'published' },
    imageUrl: String,
    enrolledCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

const newCourses = [
  {
    title: 'Global Market Intelligence & Strategy',
    description: 'Master the art of competitive intelligence and global strategic planning to drive international business growth.',
    category: 'Short Executive Courses',
    level: 'advanced',
    duration: 20,
    price: 2,
    instructor: 'Dr. Sarah Jenkins',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop',
  },
  {
    title: 'Cross-Cultural Leadership & Communication',
    description: 'Develop essential leadership skills to effectively manage and communicate across diverse cultural environments.',
    category: 'Short Executive Courses',
    level: 'intermediate',
    duration: 15,
    price: 2,
    instructor: 'Michael Chen',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
  },
  {
    title: 'Legal, Regulatory & Compliance Readiness',
    description: 'Navigate complex international legal frameworks and ensure your organization meets all regulatory requirements.',
    category: 'Short Executive Courses',
    level: 'advanced',
    duration: 25,
    price: 2,
    instructor: 'Alistair Graham',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop',
  },
  {
    title: 'Financial Strategy for Global Growth',
    description: 'Advanced financial planning and risk management strategies for companies expanding into global markets.',
    category: 'Short Executive Courses',
    level: 'advanced',
    duration: 30,
    price: 2,
    instructor: 'Elena Rodriguez',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
  },
  {
    title: 'Introduction to Project Management',
    description: 'Learn the fundamental principles, tools, and techniques of project management for successful project delivery.',
    category: 'Project Management Courses',
    level: 'beginner',
    duration: 10,
    price: 2,
    instructor: 'John Smith',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop',
  },
  {
    title: 'PRINCE2 (Project Management)',
    description: 'Comprehensive training in the PRINCE2 methodology, preparing you for the Foundation and Practitioner certifications.',
    category: 'Project Management Courses',
    level: 'intermediate',
    duration: 40,
    price: 2,
    instructor: 'Peter Parker',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
  },
  {
    title: 'Introduction to Management',
    description: 'Master the core principles of effective management and learn how to lead teams toward organizational success.',
    category: 'Management & Leadership Courses',
    level: 'beginner',
    duration: 15,
    price: 2,
    instructor: 'David Wilson',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
  },
  {
    title: 'Matrix Management',
    description: 'Learn how to navigate and succeed within complex matrix organizational structures and multi-reporting lines.',
    category: 'Management & Leadership Courses',
    level: 'intermediate',
    duration: 12,
    price: 2,
    instructor: 'Sarah Thompson',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop',
  },
  {
    title: 'Stakeholder Management',
    description: 'Identify, analyze, and manage relationships with key stakeholders to ensure project and business success.',
    category: 'Management & Leadership Courses',
    level: 'intermediate',
    duration: 10,
    price: 2,
    instructor: 'Marcus Aurelius',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop',
  },
  {
    title: 'Customer Relationship Management',
    description: 'Build and maintain strong customer relationships using modern CRM strategies and technological tools.',
    category: 'Management & Leadership Courses',
    level: 'beginner',
    duration: 14,
    price: 2,
    instructor: 'Jessica Pearson',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop',
  },
];

async function reseed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 45000,
      retryWrites: true,
      w: 'majority',
      retryReads: true,
      family: 4,
    });
    console.log('Connected.');

    console.log('Deleting all existing courses...');
    const deleteResult = await Course.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} courses.`);

    console.log('Inserting new courses...');
    const insertResult = await Course.insertMany(newCourses);
    console.log(`Inserted ${insertResult.length} courses.`);

    process.exit(0);
  } catch (error) {
    console.error('Error during reseeding:', error);
    process.exit(1);
  }
}

reseed();
