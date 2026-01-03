import { connectToDatabase } from '../../../src/server/db/mongoose';
import UserModel from '../../../src/server/db/models/user.model';
import EventModel from '../../../src/server/db/models/event.model';
import EnrollmentModel from '../../../src/server/db/models/enrollment.model';
import { Card } from '../../../src/components/ui';

export default async function SubAdminDashboard() {
  try {
    await connectToDatabase();

    const [totalUsers, totalEvents, totalEnrollments] = await Promise.all([
      UserModel.countDocuments(),
      EventModel.countDocuments(),
      EnrollmentModel.countDocuments(),
    ]);

    const activeEvents = await EventModel.countDocuments({ status: 'active' });
    const completedEnrollments = await EnrollmentModel.countDocuments({ status: 'completed' });

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Sub Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="p-6">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-3xl font-bold text-gray-900">{totalEvents}</p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <p className="text-sm text-gray-600">Active Events</p>
              <p className="text-3xl font-bold text-gray-900">{activeEvents}</p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <p className="text-sm text-gray-600">Total Enrollments</p>
              <p className="text-3xl font-bold text-gray-900">{totalEnrollments}</p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <p className="text-sm text-gray-600">Completed Enrollments</p>
              <p className="text-3xl font-bold text-gray-900">{completedEnrollments}</p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
            <p className="text-gray-600">
              Welcome to the Sub Admin Dashboard. Use the navigation menu to manage users, events, and enrollments.
            </p>
          </div>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return <div className="text-red-600">Error loading dashboard data</div>;
  }
}
