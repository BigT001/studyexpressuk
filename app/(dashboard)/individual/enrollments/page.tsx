import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import EnrollmentModel from '@/server/db/models/enrollment.model';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function EnrollmentsPage() {
  const session = await getServerAuthSession();

  if (!session || session.user?.role !== 'INDIVIDUAL') {
    redirect('/auth/signin');
  }

  await connectToDatabase();
  const enrollments = await EnrollmentModel.find({ userId: session.user.id }).lean();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-gray-900 mb-2">My Enrollments</h1>
        <p className="text-gray-600">Track your progress across all enrolled courses and events</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <p className="text-gray-600 font-semibold mb-2">Total Enrolled</p>
          <p className="text-4xl font-black text-gray-900">{enrollments.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <p className="text-gray-600 font-semibold mb-2">In Progress</p>
          <p className="text-4xl font-black text-gray-900">
            {enrollments.filter(e => e.status === 'in_progress').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <p className="text-gray-600 font-semibold mb-2">Completed</p>
          <p className="text-4xl font-black text-gray-900">
            {enrollments.filter(e => e.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Enrollments List */}
      {enrollments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Not Enrolled Yet</h3>
          <p className="text-gray-600 mb-6">You haven't enrolled in any courses yet. Explore available courses to get started!</p>
          <Link
            href="/courses"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#008200] to-[#00B300] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {enrollments.map((enrollment, idx) => {
            const progress = enrollment.progress || 0;
            const status = enrollment.status || 'active';
            const isCompleted = status === 'completed';
            
            return (
              <div key={idx} className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {enrollment.eventId?.toString() || 'Course'} #{enrollment._id?.toString()}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Enrolled on {enrollment.createdAt ? new Date(enrollment.createdAt).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-semibold text-sm ${
                    isCompleted 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {status === 'completed' ? '✓ Completed' : '⏳ In Progress'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-700">Progress</p>
                    <p className="font-bold text-gray-900">{progress}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#008200] to-[#00B300] h-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-4 gap-6 mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Duration</p>
                    <p className="font-bold text-gray-900">4 Weeks</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Level</p>
                    <p className="font-bold text-gray-900">Beginner</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Instructor</p>
                    <p className="font-bold text-gray-900">Expert Team</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Completion Date</p>
                    <p className="font-bold text-gray-900">
                      {enrollment.completionDate ? new Date(enrollment.completionDate).toLocaleDateString() : '—'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button className="flex-1 px-4 py-3 bg-[#008200] text-white font-bold rounded-lg hover:bg-[#006600] transition-colors">
                    Continue Learning
                  </button>
                  {isCompleted && (
                    <button className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition-colors">
                      Download Certificate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certificates Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">My Certificates</h3>
        {enrollments.filter(e => e.status === 'completed').length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Complete a course to earn a certificate!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {enrollments
              .filter(e => e.status === 'completed')
              .map((enrollment, idx) => (
                <div key={idx} className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">Certificate of Completion</h4>
                      <p className="text-sm text-gray-600 mt-1">{enrollment.eventId?.toString() || 'Course'}</p>
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
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
