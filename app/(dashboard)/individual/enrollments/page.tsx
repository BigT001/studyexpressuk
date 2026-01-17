import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import EnrollmentModel, { IEnrollment } from '@/server/db/models/enrollment.model';
import CourseModel, { ICourse } from '@/server/db/models/course.model';
import { redirect } from 'next/navigation';
import Link from 'next/link';

type PopulatedEnrollment = Omit<IEnrollment, 'eventId'> & {
  eventId: ICourse | null;
};

export default async function EnrollmentsPage() {
  const session = await getServerAuthSession();
  if (!session || !['INDIVIDUAL', 'STAFF'].includes(session.user?.role || '')) {
    redirect('/auth/signin');
  }
  await connectToDatabase();
  const enrollments = await EnrollmentModel.find({ userId: session.user.id })
    .populate({ path: 'eventId', model: CourseModel })
    .lean();

  // Filter out empty enrollments (where eventId doesn't have _id)
  const validEnrollments = enrollments.filter((e: any) => e.eventId && e.eventId._id) as unknown as PopulatedEnrollment[];

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
            <p className="text-2xl font-bold text-green-700">{validEnrollments.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">⏳</span>
            <p className="text-sm text-gray-500 font-semibold mb-1">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">{validEnrollments.filter((e: PopulatedEnrollment) => e.status === 'in_progress').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">✅</span>
            <p className="text-sm text-gray-500 font-semibold mb-1">Completed</p>
            <p className="text-2xl font-bold text-blue-700">{validEnrollments.filter((e: PopulatedEnrollment) => e.status === 'completed').length}</p>
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
        {validEnrollments.length === 0 ? (
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
            {validEnrollments.map((enrollment: PopulatedEnrollment, idx: number) => {
              const course = (enrollment.eventId || {}) as Partial<ICourse>;
              return (
                <div key={idx} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col h-full">
                  {/* Image Section */}
                  <div className="relative w-full h-48 overflow-hidden bg-linear-to-br from-green-300 to-green-500 flex items-center justify-center">
                    {course.imageUrl ? (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-green-300 to-green-500 text-white">
                        <span className="text-5xl">📚</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent group-hover:from-black/50 transition-colors duration-300 pointer-events-none"></div>
                    <span className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">Enrolled</span>
                  </div>

                  {/* Card Header */}
                  <div className="bg-linear-to-r from-green-50 to-emerald-50 px-6 py-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{course.title || 'Course Title'}</h3>
                    {course.category && (
                      <p className="text-xs text-gray-600 mt-2 font-semibold uppercase tracking-wide">{course.category}</p>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col grow space-y-4">
                    {/* Description */}
                    {course.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                    )}

                    {/* Details */}
                    <div className="space-y-2 pt-2 border-t border-gray-100 mt-auto">
                      {course.duration && (
                        <div className="flex items-center gap-3">
                          <span className="text-lg">⏱️</span>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Duration</p>
                            <p className="text-sm font-bold text-gray-900">{course.duration} hours</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="text-lg">💰</span>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Price</p>
                          <p className="text-sm font-bold text-gray-900">
                            {course.price ? `$${course.price}` : 'Free'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      {/* Certificates Section */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">My Certificates</h3>
        {validEnrollments.filter((e: PopulatedEnrollment) => e.status === 'completed').length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Complete a course to earn a certificate!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {validEnrollments
              .filter((e) => e.status === 'completed' && e.eventId && e.eventId._id) // Filter out empty enrollments
              .map((enrollment, idx: number) => {
                const course = (enrollment.eventId && typeof enrollment.eventId === 'object' ? enrollment.eventId : {}) as Partial<ICourse>;
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
