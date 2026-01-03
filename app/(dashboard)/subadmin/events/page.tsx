import Link from 'next/link';
import { connectToDatabase } from '../../../../src/server/db/mongoose';
import EventModel from '../../../../src/server/db/models/event.model';
import { Card } from '../../../../src/components/ui';

export default async function SubAdminEventsPage() {
  try {
    await connectToDatabase();

    const events = await EventModel.find()
      .select('title description status date capacity enrollmentCount createdAt')
      .lean()
      .limit(100);

    const statusStats = {
      active: events.filter((e: any) => e.status === 'active').length,
      upcoming: events.filter((e: any) => e.status === 'upcoming').length,
      completed: events.filter((e: any) => e.status === 'completed').length,
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <Link
            href="/api/events"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Event
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="p-4">
              <p className="text-xs text-gray-600 uppercase">Active Events</p>
              <p className="text-2xl font-bold">{statusStats.active}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-xs text-gray-600 uppercase">Upcoming Events</p>
              <p className="text-2xl font-bold">{statusStats.upcoming}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-xs text-gray-600 uppercase">Completed Events</p>
              <p className="text-2xl font-bold">{statusStats.completed}</p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Events</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Title</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Capacity</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Enrolled</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event: any) => (
                    <tr key={event._id.toString()} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{event.title}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          event.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : event.status === 'upcoming'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{event.capacity || 'Unlimited'}</td>
                      <td className="py-3 px-4 font-semibold">{event.enrollmentCount || 0}</td>
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
    console.error('Error fetching events:', error);
    return <div className="text-red-600">Error loading events</div>;
  }
}
