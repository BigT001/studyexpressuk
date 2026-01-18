'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Loader } from 'lucide-react';
import { EventsDisplaySection } from '@/components/events/EventsDisplaySection';

interface Event {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  startDate: string;
  category?: string;
  location?: string;
  format?: string;
  status?: string;
}

interface Enrollment {
  _id: string;
  eventId: Event;
  enrollmentDate: string;
  status: string;
  progress?: number;
}

export default function StaffEventsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/staff/enrollments/events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        
        // Transform the response into enrollment format for EventsDisplaySection
        const transformedEnrollments: Enrollment[] = (data.enrollments || []).map((enrollment: any) => ({
          _id: enrollment._id,
          eventId: enrollment.eventId,
          enrollmentDate: enrollment.enrollmentDate || enrollment.createdAt || new Date().toISOString(),
          status: enrollment.status || 'active',
          progress: enrollment.progress || 0,
        }));
        
        setEnrollments(transformedEnrollments);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-gray-600">Loading your events...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Error loading events</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Events Display */}
        {!loading && !error && (
          <EventsDisplaySection 
            enrollments={enrollments}
            role="STAFF"
            browseEventsPath="/events"
          />
        )}
      </div>
    </div>
  );
}
