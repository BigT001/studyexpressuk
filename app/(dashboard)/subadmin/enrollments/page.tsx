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
      .populate('subjectId', 'email')
      .populate('eventId', 'title')
      .select('status enrollmentDate completionDate progress')
      .lean()
      .maxTimeMS(30000)
      .limit(100);

    const statusStats = {
      active: enrollments.filter((e: any) => e.status === 'active').length,
      completed: enrollments.filter((e: any) => e.status === 'completed').length,
      pending: enrollments.filter((e: any) => e.status === 'pending').length,
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
            <div className="p-4">
              <p className="text-xs text-gray-600 uppercase">Total Enrollments</p>
              <p className="text-2xl font-bold">{enrollments.length}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-xs text-gray-600 uppercase">Active</p>
              <p className="text-2xl font-bold">{statusStats.active}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-xs text-gray-600 uppercase">Completed</p>
              <p className="text-2xl font-bold">{statusStats.completed}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-xs text-gray-600 uppercase">Avg Progress</p>
              <p className="text-2xl font-bold">{avgProgress}%</p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Enrollments</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">User</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Event</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Progress</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Enrolled Date</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment: any) => (
                    <tr key={enrollment._id.toString()} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">
                        {(enrollment.subjectId as any)?.email || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {(enrollment.eventId as any)?.title || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          enrollment.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : enrollment.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {enrollment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${enrollment.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{enrollment.progress || 0}%</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {enrollment.enrollmentDate ? new Date(enrollment.enrollmentDate).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return <div className="text-red-600">Error loading enrollments</div>;
  }
}
