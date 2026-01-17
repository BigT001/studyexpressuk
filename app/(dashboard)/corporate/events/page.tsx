'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Users, Loader, X } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description?: string;
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  format?: string;
  imageUrl?: string;
  status?: string;
  maxCapacity?: number;
  currentEnrollment?: number;
  instructor?: { _id: string; fullName?: string; email?: string };
}

export default function CorporateEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/corporates/events');
      const data = await res.json();

      if (data.success) {
        setEvents(data.events || []);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-600 mx-auto animate-spin mb-4" />
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-2">All registered events for your organization</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
              onClick={() => setSelectedEvent(event)}
            >
              {/* Event Image */}
              {event.imageUrl && (
                <div className="relative w-full aspect-video overflow-hidden bg-gray-200">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Header */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{event.title}</h3>
                  {event.category && (
                    <p className="text-xs text-gray-600 mt-1">{event.category}</p>
                  )}
                </div>

                {/* Description */}
                {event.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                )}

                {/* Status Badge */}
                <div className="flex gap-2">
                  {event.status && (
                    <span className="inline-flex text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  )}
                  {event.format && (
                    <span className="inline-flex text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      {event.format.charAt(0).toUpperCase() + event.format.slice(1)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  {event.startDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{formatDate(event.startDate)}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 truncate">{event.location}</span>
                    </div>
                  )}
                  {event.maxCapacity && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {event.currentEnrollment || 0} / {event.maxCapacity} enrolled
                      </span>
                    </div>
                  )}
                </div>

                {/* Instructor */}
                {event.instructor && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Instructor</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{event.instructor.fullName || event.instructor.email}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No events registered yet</h3>
          <p className="text-gray-600">Your organization hasn't registered any events yet.</p>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                {selectedEvent.category && (
                  <p className="text-sm text-gray-600 mt-1">{selectedEvent.category}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600 ml-4 flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {selectedEvent.imageUrl && (
                <div className="relative w-full aspect-video overflow-hidden bg-gray-200 rounded-lg">
                  <Image
                    src={selectedEvent.imageUrl}
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {selectedEvent.description && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedEvent.description}</p>
                </div>
              )}

              {/* Event Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                {selectedEvent.startDate && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Start Date</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(selectedEvent.startDate)}</p>
                  </div>
                )}
                {selectedEvent.endDate && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">End Date</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(selectedEvent.endDate)}</p>
                  </div>
                )}
                {selectedEvent.location && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Location</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedEvent.location}</p>
                  </div>
                )}
                {selectedEvent.format && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Format</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1 capitalize">{selectedEvent.format}</p>
                  </div>
                )}
                {selectedEvent.status && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Status</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1 capitalize">{selectedEvent.status}</p>
                  </div>
                )}
                {selectedEvent.maxCapacity && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Capacity</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {selectedEvent.currentEnrollment || 0} / {selectedEvent.maxCapacity}
                    </p>
                  </div>
                )}
              </div>

              {selectedEvent.instructor && (
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Instructor</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{selectedEvent.instructor.fullName || selectedEvent.instructor.email}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 sticky bottom-0 bg-white flex justify-end gap-3">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
