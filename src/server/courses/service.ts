import { connectToDatabase } from '../db/mongoose';
import CourseModel, { ICourse } from '../db/models/course.model';

export async function createCourse(data: Partial<ICourse>) {
  try {
    await connectToDatabase();
    const course = await CourseModel.create(data);
    return course.toObject();
  } catch (error) {
    console.error('Error in createCourse:', error);
    throw error;
  }
}

export async function listCourses(limit = 100) {
  try {
    await connectToDatabase();
    const courses = await CourseModel.find().sort({ createdAt: -1 }).limit(limit).lean();
    return courses || [];
  } catch (error) {
    console.error('Error in listCourses:', error);
    throw error;
  }
}

export async function getCourseById(id: string) {
  try {
    await connectToDatabase();
    return CourseModel.findById(id).lean();
  } catch (error) {
    console.error('Error in getCourseById:', error);
    throw error;
  }
}

export async function updateCourse(id: string, data: Partial<ICourse>) {
  try {
    await connectToDatabase();
    const course = await CourseModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).lean();
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    return course;
  } catch (error) {
    console.error('Error in updateCourse:', error);
    throw error;
  }
}

export async function deleteCourse(id: string) {
  try {
    await connectToDatabase();
    const result = await CourseModel.deleteOne({ _id: id });
    
    if (result.deletedCount === 0) {
      throw new Error('Course not found');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in deleteCourse:', error);
    throw error;
  }
}
