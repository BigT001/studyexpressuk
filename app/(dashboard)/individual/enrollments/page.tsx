import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import EnrollmentModel from '@/server/db/models/enrollment.model';
import CourseModel, { ICourse } from '@/server/db/models/course.model';
import CourseCard from '@/components/admin/CourseCard';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function EnrollmentsPage() {
  const session = await getServerAuthSession();
  if (!session || !['INDIVIDUAL', 'STAFF'].includes(session.user?.role || '')) {
    redirect('/auth/signin');
  }
  await connectToDatabase();
  const enrollments = await EnrollmentModel.find({ userId: session.user.id })
    .populate({ path: 'eventId', model: CourseModel })
    .lean();

  // Return a single parent element
  return (
    <main className="space-y-8">
      <section>
        <h1 className="text-4xl font-black text-gray-900 mb-2">My Enrollments</h1>
        <p className="text-gray-600 mb-6">Track your progress across all enrolled courses and events</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">📚</span>
            <p className="text-sm text-gray-500 font-semibold mb-1">Total Enrolled</p>
            <p className="text-2xl font-bold text-green-700">{enrollments.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">⏳</span>
            <p className="text-sm text-gray-500 font-semibold mb-1">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">{enrollments.filter((e: any) => e.status === 'in_progress').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">✅</span>
            <p className="text-sm text-gray-500 font-semibold mb-1">Completed</p>
            <p className="text-2xl font-bold text-blue-700">{enrollments.filter((e: any) => e.status === 'completed').length}</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <Link
              href="/courses"
              className="inline-block px-6 py-3 bg-linear-to-r from-[#008200] to-[#00B300] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
      <section>
        {enrollments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Not Enrolled Yet</h3>
            <p className="text-gray-600 mb-6">You haven&apos;t enrolled in any courses yet. Explore available courses to get started!</p>
            <Link
              href="/courses"
              className="inline-block px-6 py-3 bg-linear-to-r from-[#008200] to-[#00B300] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {enrollments.map((enrollment: any, idx: number) => {
              const course = (enrollment.eventId || {}) as Partial<ICourse>;
              return (
                <div key={idx} className="relative">
                  <CourseCard
                    _id={course._id?.toString() || ''}
                    title={course.title || 'Course Title'}
                    description={course.description}
                    category={course.category}
                    level={course.level}
                    status={course.status || 'active'}
                    duration={course.duration}
                    price={course.price}
                    instructor={course.instructor}
                    enrolledCount={course.enrolledCount}
                    imageUrl={course.imageUrl}
                  />
                  <span className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Enrolled</span>
                </div>
              );
            })}
          </div>
        )}
      </section>
      {/* Certificates Section */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">My Certificates</h3>
        {enrollments.filter((e: any) => e.status === 'completed').length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Complete a course to earn a certificate!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {enrollments
              .filter((e: any) => e.status === 'completed')
              .map((enrollment: any, idx: number) => {
                const course = enrollment.eventId && typeof enrollment.eventId === 'object' ? enrollment.eventId : {};
                return (
                  <div key={idx} className="bg-linear-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">Certificate of Completion</h4>
                        <p className="text-sm text-gray-600 mt-1">{course.title || 'Course'}</p>
                      </div>
                      <span className="text-3xl">🏆</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Earned on {enrollment.completionDate ? new Date(enrollment.completionDate).toLocaleDateString() : 'Recently'}
                    </p>
                    <button className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors">
                      Download Certificate
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </main>
  );
}
