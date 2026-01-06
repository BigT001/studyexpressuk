'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function ExploreEvents() {
  const [activeTab, setActiveTab] = useState('Events');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                    <button className="w-full px-4 py-2 text-white rounded hover:opacity-90 transition-colors text-sm font-bold" style={{ backgroundColor: '#008200' }}>
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
      </div>
    </section>
  );
}
