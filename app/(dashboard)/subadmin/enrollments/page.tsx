import { connectToDatabase } from '../../../../src/server/db/mongoose';
import EnrollmentModel from '../../../../src/server/db/models/enrollment.model';
import UserModel from '../../../../src/server/db/models/user.model';
import EventModel from '../../../../src/server/db/models/event.model';
import { Card } from '../../../../src/components/ui';

// Mark this page as dynamic to prevent build-time data fetching
export const dynamic = 'force-dynamic';

export default async function SubAdminEnrollmentsPage() {
  try {
    await connectToDatabase();

    const enrollments = await EnrollmentModel.find()
      .populate('userId', 'email firstName lastName profileImage')
      .populate('eventId', 'title')
      .select('status progress createdAt completionDate')
      .lean()
      .maxTimeMS(30000)
      .limit(100);

    const statusStats = {
      enrolled: enrollments.filter((e: any) => e.status === 'enrolled').length,
      completed: enrollments.filter((e: any) => e.status === 'completed').length,
      inProgress: enrollments.filter((e: any) => e.status === 'in_progress').length,
    };

    const avgProgress = enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum: number, e: any) => sum + (e.progress || 0), 0) / enrollments.length
        )
      : 0;

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Enrollment Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="p-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Enrollments</p>
              <p className="text-2xl font-black text-gray-900">{enrollments.length}</p>
            </div>
          </Card>
          <Card>
            <div className="p-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Currently Enrolled</p>
              <p className="text-2xl font-black text-gray-900">{statusStats.enrolled}</p>
            </div>
          </Card>
          <Card>
            <div className="p-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-black text-gray-900">{statusStats.completed}</p>
            </div>
          </Card>
          <Card>
            <div className="p-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Progress</p>
              <p className="text-2xl font-black text-gray-900">{avgProgress}%</p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-bold text-gray-700">User</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Event / Course</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Progress</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Enrolled Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enrollments.length > 0 ? (
                  enrollments.map((enrollment: any) => (
                  <tr key={enrollment._id.toString()} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {enrollment.userId?.firstName ? `${enrollment.userId.firstName} ${enrollment.userId.lastName || ''}` : enrollment.userId?.email || 'Unknown User'}
                      </div>
                      <div className="text-xs text-gray-500">{enrollment.userId?.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {enrollment.eventId?.title || 'Unknown Event'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                        enrollment.status === 'completed' ? 'bg-green-100 text-green-700' :
                        enrollment.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {enrollment.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[100px]">
                          <div
                            className="bg-[#008200] h-1.5 rounded-full"
                            style={{ width: `${enrollment.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-600">{enrollment.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {enrollment.createdAt ? new Date(enrollment.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">
                      No enrollments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return <div className="text-red-600">Error loading enrollments</div>;
  }
}
