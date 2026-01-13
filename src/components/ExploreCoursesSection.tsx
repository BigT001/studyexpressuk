// Utility function to check if user is logged in
function isUserLoggedIn(session: any, status: string) {
  return status === 'authenticated' && session && session.user && session.user.email;
}
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export function ExploreEvents() {
  const [activeTab, setActiveTab] = useState('Events');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    referralCode: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setForm(f => ({
        ...f,
        email: session.user.email || ''
      }));
    }
  }, [session]);

  const handleEnrollClick = (event: any) => {
    if (status === 'loading') return;
    if (!isUserLoggedIn(session, status)) {
      window.location.href = '/auth/signin';
      return;
    }
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Call API to enroll user in event
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent._id,
          ...form
        })
      });
      if (!res.ok) throw new Error('Failed to enroll');
      setSuccess(true);
      setShowModal(false);
      // Optionally: trigger admin update/notification
    } catch (err) {
      alert('Enrollment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = ['Events'];

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'TBA';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Limit to 8 events
  const displayedEvents = events.slice(0, 8);
  const hasMoreEvents = events.length > 8;

  const filteredCards = activeTab === 'Events' 
    ? displayedEvents
    : [];

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, rgba(0, 130, 0, 0.05), white, rgba(14, 51, 134, 0.05))' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-10" style={{ backgroundColor: '#008200' }}></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6">
            <h2 className="text-4xl md:text-4xl font-black mb-4 text-gray-900">
              Explore <span style={{ color: '#008200' }}>Recent Events</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our latest upcoming events and professional development opportunities.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading events...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading events: {error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No events available at the moment.</p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && filteredCards.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredCards.map((item) => (
                <div key={item._id || item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                  {/* Image Container */}
                  <div className="relative w-full h-48 overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #008200, #00B300)' }}>
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-sm font-medium">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description || 'No description available'}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-col gap-2 mb-4 text-xs text-gray-500">
                      {item.startDate && (
                        <span>
                          📅 {formatDate(item.startDate)}
                          {item.endDate && ` - ${formatDate(item.endDate)}`}
                        </span>
                      )}
                      {item.location && (
                        <span>
                          📍 {item.location}
                        </span>
                      )}
                      {item.maxCapacity && (
                        <span>
                          👥 Capacity: {item.currentEnrollment || 0}/{item.maxCapacity}
                        </span>
                      )}
                    </div>

                    {/* Button */}
                    <button
                      className="w-full px-4 py-2 text-white rounded hover:opacity-90 transition-colors text-sm font-bold"
                      style={{ backgroundColor: '#008200' }}
                      onClick={() => handleEnrollClick(item)}
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Discover More Button */}
            {hasMoreEvents && (
              <div className="mt-12 flex justify-center">
                <Link 
                  href="/events"
                  className="px-8 py-3 text-white rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: '#008200' }}
                >
                  Discover More Events
                </Link>
              </div>
            )}
          </>
        )}
      {/* Enrollment Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-gray-900">Enroll in {selectedEvent.title}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="firstName" value={form.firstName} onChange={handleFormChange} required placeholder="First Name" className="w-full border rounded px-3 py-2" />
              <input name="lastName" value={form.lastName} onChange={handleFormChange} required placeholder="Last Name" className="w-full border rounded px-3 py-2" />
              <input name="email" value={form.email} onChange={handleFormChange} required placeholder="Email" className="w-full border rounded px-3 py-2" type="email" />
              <input name="phone" value={form.phone} onChange={handleFormChange} required placeholder="Phone Number" className="w-full border rounded px-3 py-2" />
              <input name="location" value={form.location} onChange={handleFormChange} required placeholder="Location" className="w-full border rounded px-3 py-2" />
              <input name="referralCode" value={form.referralCode} onChange={handleFormChange} placeholder="Referral Code (optional)" className="w-full border rounded px-3 py-2" />
              <button type="submit" disabled={submitting} className="w-full bg-green-600 text-white py-2 rounded font-bold mt-2 hover:bg-green-700 transition-colors">
                {submitting ? 'Enrolling...' : 'Confirm Enrollment'}
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
    </section>
  );
}
