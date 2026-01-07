import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import EnrollmentModel from '@/server/db/models/enrollment.model';
import EventModel from '@/server/db/models/event.model';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function EventsPage() {
  const session = await getServerAuthSession();
  if (!session || session.user?.role !== 'INDIVIDUAL') {
    redirect('/auth/signin');
  }
  await connectToDatabase();
  // Only fetch enrollments for events (not courses)
  const enrollments = await EnrollmentModel.find({ userId: session.user.id })
    .populate({ path: 'eventId', model: EventModel })
    .lean();


  // Only count enrollments with valid event data for 'Registered'
  const validEnrollments = enrollments.filter((enrollment: any) => {
    const event = enrollment.eventId || {};
    return event && (event.title || event.imageUrl || event.description || event.category || event.access || event.startDate || event.format || event.location || event.maxCapacity);
  });
  const totalRegistered = validEnrollments.length;
  const inProgress = validEnrollments.filter((e: any) => e.status === 'in_progress').length;
  const completed = validEnrollments.filter((e: any) => e.status === 'completed').length;

  return (
    <main className="space-y-8">
      <section>
        <h1 className="text-4xl font-black text-gray-900 mb-2">My Registered Events</h1>
        <p className="text-gray-600 mb-6">All events you have registered for will appear here.</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🎫</span>
            <p className="text-sm text-gray-500 font-semibold mb-1">Registered</p>
            <p className="text-2xl font-bold text-green-700">{totalRegistered}</p>
          </div>
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">⏳</span>
            <p className="text-sm text-gray-500 font-semibold mb-1">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">{inProgress}</p>
          </div>
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">✅</span>
            <p className="text-sm text-gray-500 font-semibold mb-1">Completed</p>
            <p className="text-2xl font-bold text-blue-700">{completed}</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <Link
              href="/events"
              className="inline-block px-6 py-3 bg-linear-to-r from-[#008200] to-[#00B300] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>
      <section>
        {validEnrollments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Events Registered</h3>
            <p className="text-gray-600 mb-6">You haven&apos;t registered for any events yet. Explore available events to get started!</p>
            <Link
              href="/events"
              className="inline-block px-6 py-3 bg-linear-to-r from-[#008200] to-[#00B300] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {validEnrollments.map((enrollment: any, idx: number) => {
              const event = enrollment.eventId || {};
              return (
                <div key={idx} className="relative">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col h-full overflow-hidden">
                    {/* Event Image */}
                    {event.imageUrl && (
                      <div className="relative w-full aspect-video overflow-hidden bg-linear-to-br from-green-400 to-blue-500">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      </div>
                    )}
                    {/* Content */}
                    <div className="px-6 pt-6 pb-0 flex-1 flex flex-col">
                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {event.type && (
                          <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#008200' }}>
                            {event.type === 'course' ? '📚 Course' : '🎯 Event'}
                          </span>
                        )}
                        {event.access && (
                          <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: event.access === 'premium' ? '#FFA500' : event.access === 'corporate' ? '#0E3386' : '#10B981' }}>
                            {event.access === 'premium' ? '💎 Premium' : event.access === 'corporate' ? '🏢 Corporate' : '🆓 Free'}
                          </span>
                        )}
                        {event.startDate && (
                          <span className="text-xs text-gray-600 font-medium bg-gray-100 px-3 py-1.5 rounded-full">
                            📅 {new Date(event.startDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                        {event.format && (
                          <span
                            className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: event.format === 'offline' ? '#FF6B35' : event.format === 'hybrid' ? '#7C3AED' : '#0066CC' }}
                          >
                            {event.format === 'offline' ? '📍 Offline' : event.format === 'hybrid' ? '🔄 Hybrid' : '🌐 Online'}
                          </span>
                        )}
                      </div>
                      {event.title && (
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                          {event.title}
                        </h3>
                      )}
                      {event.description && (
                        <p className="text-gray-600 mb-5 text-sm line-clamp-3">
                          {event.description}
                        </p>
                      )}
                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-5">
                        {event.startDate && (
                          <div className="flex items-start gap-2">
                            <span className="text-lg leading-none">🕐</span>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Time</p>
                              <p className="text-gray-900 font-bold text-sm">{new Date(event.startDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-start gap-2">
                            <span className="text-lg leading-none">📍</span>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Location</p>
                              <p className="text-gray-900 font-bold text-sm truncate">{event.location}</p>
                            </div>
                          </div>
                        )}
                        {event.maxCapacity && (
                          <div className="flex items-start gap-2">
                            <span className="text-lg leading-none">👥</span>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Capacity</p>
                              <p className="text-gray-900 font-bold text-sm">{event.currentEnrollment || 0}/{event.maxCapacity}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="inline-block bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow mb-2 self-start">Registered</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
