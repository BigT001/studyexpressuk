'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Event {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  type: 'course' | 'event';
  category?: string;
  access: 'free' | 'premium' | 'corporate';
  format?: 'online' | 'offline' | 'hybrid';
  startDate?: string;
  endDate?: string;
  maxCapacity?: number;
  currentEnrollment?: number;
  location?: string;
  imageUrl?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        console.log('===== FETCH EVENTS PAGE =====');
        console.log('Raw API response:', data);
        console.log('Events array:', data.events);
        if (data.events && data.events.length > 0) {
          console.log('First event format field:', data.events[0].format);
          data.events.forEach((event: Event, idx: number) => {
            console.log(`Event ${idx}: ${event.title}, format=${event.format}`);
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

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'TBA';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date: string | Date | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  // Filter events based on search
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-6 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Upcoming <span style={{ color: '#008200' }}>Events</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our community at exclusive webinars, workshops, and networking events.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading events...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">Error loading events: {error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No events match your search.' : 'No events available at the moment.'}
            </p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event._id || event.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 break-inside-avoid mb-6"
                >
                  {/* Image with Overlay */}
                  {event.imageUrl && (
                    <div className="relative w-full aspect-video overflow-hidden bg-linear-to-br from-green-400 to-blue-500">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="px-6 pt-6 pb-0">
                    {/* Title */}
                    <div>
                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#008200' }}>
                          {event.type === 'course' ? '📚 Course' : '🎯 Event'}
                        </span>
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: event.access === 'premium' ? '#FFA500' : event.access === 'corporate' ? '#0E3386' : '#10B981' }}>
                          {event.access === 'premium' ? '💎 Premium' : event.access === 'corporate' ? '🏢 Corporate' : '🆓 Free'}
                        </span>
                        <span className="text-xs text-gray-600 font-medium bg-gray-100 px-3 py-1.5 rounded-full">
                          📅 {formatDate(event.startDate)}
                        </span>
                        {(() => {
                          console.log(`Rendering card for: "${event.title}", format="${event.format}", bool=${!!event.format}`);
                          return (
                            event.format && (
                              <span
                                className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                                style={{ backgroundColor: event.format === 'offline' ? '#FF6B35' : event.format === 'hybrid' ? '#7C3AED' : '#0066CC' }}
                              >
                                {event.format === 'offline' ? '📍 Offline' : event.format === 'hybrid' ? '🔄 Hybrid' : '🌐 Online'}
                              </span>
                            )
                          );
                        })()}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 mb-5 text-sm line-clamp-3">
                        {event.description || 'No description available'}
                      </p>

                      {/* Separator */}
                      <div className="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent mb-5"></div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-5">
                        {event.startDate && (
                          <div className="flex items-start gap-2">
                            <span className="text-lg leading-none">🕐</span>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Time</p>
                              <p className="text-gray-900 font-bold text-sm">{formatTime(event.startDate)}</p>
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


                    </div>
                  </div>

                  {/* Button - Full Width */}
                  <button
                    className="w-full px-6 py-3 text-white rounded-lg hover:shadow-xl transition-all duration-300 font-bold text-sm hover:scale-105 transform active:scale-95"
                    style={{ backgroundColor: '#008200' }}
                  >
                    Register Now →
                  </button>
                </div>
              ))}
            </div>

            {/* Results Counter */}
            <div className="mt-12 text-center text-gray-600">
              <p className="text-sm">Showing <span className="font-bold text-gray-900">{filteredEvents.length}</span> of <span className="font-bold text-gray-900">{events.length}</span> events</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
