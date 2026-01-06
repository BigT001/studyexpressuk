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
        console.log('===== EXPLORE EVENTS FETCH =====');
        console.log('Raw API response:', data);
        console.log('Events array:', data.events);
        if (data.events && data.events.length > 0) {
          console.log('First event:', data.events[0]);
          console.log('First event format field:', data.events[0].format);
          console.log('First event format is truthy:', !!data.events[0].format);
          data.events.forEach((event: any, idx: number) => {
            console.log(`Event ${idx}: "${event.title}" - format="${event.format || 'UNDEFINED'}" - format truthy: ${!!event.format}`);
          });
        }
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

  // Limit to 6 events
  const displayedEvents = events.slice(0, 6);
  const hasMoreEvents = events.length > 6;

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
              {filteredCards.map((item) => (
                <div key={item._id || item.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100">
                  {/* Image Container with Badge Overlay */}
                  <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-green-400 to-blue-500">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-sm font-medium">
                        No Image
                      </div>
                    )}
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="px-6 pt-6 pb-0">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#008200' }}>
                        {item.type === 'course' ? '📚 Course' : '🎯 Event'}
                      </span>
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: item.access === 'premium' ? '#FFA500' : item.access === 'corporate' ? '#0E3386' : '#10B981' }}>
                        {item.access === 'premium' ? '💎 Premium' : item.access === 'corporate' ? '🏢 Corporate' : '🆓 Free'}
                      </span>
                      {(() => {
                        return item.format ? (
                          <span
                            className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: item.format === 'offline' ? '#FF6B35' : item.format === 'hybrid' ? '#7C3AED' : '#0066CC' }}
                          >
                            {item.format === 'offline' ? '📍 Offline' : item.format === 'hybrid' ? '🔄 Hybrid' : '🌐 Online'}
                          </span>
                        ) : null;
                      })()}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                      {item.description || 'No description available'}
                    </p>

                    {/* Separator */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4"></div>

                    {/* Key Details */}
                    <div className="space-y-3 mb-5">
                      {item.startDate && (
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-lg">📅</span>
                          <div className="flex-grow">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Date</p>
                            <p className="text-gray-900 font-bold">{formatDate(item.startDate)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Buttons - Side by Side */}
                  <div className="flex gap-3 px-6 py-3">
                    <button className="flex-1 px-4 py-3 text-white font-bold text-sm transition-all duration-300 hover:shadow-xl transform hover:scale-105 active:scale-95" style={{ backgroundColor: '#008200' }}>
                      Register Now →
                    </button>

                    <button className="flex-1 px-4 py-3 text-gray-900 font-bold text-sm transition-all duration-300 hover:shadow-xl transform hover:scale-105 active:scale-95 border-2 border-gray-300 hover:border-gray-400">
                      View Event
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
