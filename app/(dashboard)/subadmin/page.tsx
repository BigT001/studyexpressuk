import { connectToDatabase } from '../../../src/server/db/mongoose';
import UserModel from '../../../src/server/db/models/user.model';
import EventModel from '../../../src/server/db/models/event.model';
import EnrollmentModel from '../../../src/server/db/models/enrollment.model';
import { Card } from '../../../src/components/ui';

// Mark this page as dynamic to prevent build-time data fetching
export const dynamic = 'force-dynamic';

export default async function SubAdminDashboard() {
  try {
    await connectToDatabase();

    const [totalUsers, totalEvents, totalEnrollments] = await Promise.all([
      UserModel.countDocuments().maxTimeMS(30000),
      EventModel.countDocuments().maxTimeMS(30000),
      EnrollmentModel.countDocuments().maxTimeMS(30000),
    ]);

    const activeEvents = await EventModel.countDocuments({ status: 'active' }).maxTimeMS(30000);
    const completedEnrollments = await EnrollmentModel.countDocuments({ status: 'completed' }).maxTimeMS(30000);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Sub Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage platform users, events, and enrollments</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card>
              <div className="p-4 md:p-6">
                <p className="text-xs md:text-sm text-gray-600 font-medium">Total Users</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{totalUsers}</p>
              </div>
            </Card>

            <Card>
              <div className="p-4 md:p-6">
                <p className="text-xs md:text-sm text-gray-600 font-medium">Total Events</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{totalEvents}</p>
              </div>
            </Card>

            <Card>
              <div className="p-4 md:p-6">
                <p className="text-xs md:text-sm text-gray-600 font-medium">Active Events</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{activeEvents}</p>
              </div>
            </Card>

            <Card>
              <div className="p-4 md:p-6">
                <p className="text-xs md:text-sm text-gray-600 font-medium">Total Enrollments</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{totalEnrollments}</p>
              </div>
            </Card>

            <Card>
              <div className="p-4 md:p-6">
                <p className="text-xs md:text-sm text-gray-600 font-medium">Completed Enrollments</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{completedEnrollments}</p>
              </div>
            </Card>
          </div>

          <Card>
            <div className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
              <p className="text-gray-600 text-sm md:text-base">
                Welcome to the Sub Admin Dashboard. Use the navigation menu to manage users, events, and enrollments.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return <div className="text-red-600">Error loading dashboard data</div>;
  }
}
