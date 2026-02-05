'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  price?: number;
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'title'>('date');
  const { data: session, status } = useSession();
  const router = useRouter();

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

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'TBA';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (date: string | Date | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const handleRegister = async (event: Event) => {
    if (status !== 'authenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: event._id,
          itemType: 'event',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate checkout');
      }

      if (data.free) {
        alert(data.message || 'Successfully registered!');
        router.push('/individual/events');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  // Get unique categories
  const categories = ['all', ...new Set(events.map(e => e.category).filter(Boolean))];

  // Filter and sort events
  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesFormat = selectedFormat === 'all' || event.format === selectedFormat;
      const matchesPrice = selectedPrice === 'all' ||
        (selectedPrice === 'free' && (!event.price || event.price === 0)) ||
        (selectedPrice === 'paid' && event.price && event.price > 0);

      return matchesSearch && matchesCategory && matchesFormat && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.startDate || 0).getTime() - new Date(b.startDate || 0).getTime();
      } else if (sortBy === 'price') {
        return (a.price || 0) - (b.price || 0);
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  const getFormatIcon = (format?: string) => {
    switch (format) {
      case 'online': return '🌐';
      case 'offline': return '📍';
      case 'hybrid': return '🔄';
      default: return '📅';
    }
  };

  const getFormatColor = (format?: string) => {
    switch (format) {
      case 'online': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'offline': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'hybrid': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedFormat('all');
    setSelectedPrice('all');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-white text-gray-900 overflow-hidden">
        {/* Background Image - Very Subtle */}
        <div className="absolute inset-0 opacity-5">
          <img
            src="/hero-bg.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Geometric Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-600/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-5 py-2.5 rounded-full">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium tracking-wide text-green-800">Professional Events & Training</span>
              </div>

              {/* Animated Heading - Reduced Size */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                  <span className="animate-fade-in-up inline">Discover Events That </span>
                  <span className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent animate-fade-in-up inline" style={{ animationDelay: '0.2s' }}>
                    Transform Your Future
                  </span>
                </h1>
              </div>

              {/* Description */}
              <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Connect with industry leaders, expand your knowledge, and unlock new opportunities at premier UK events.
                </p>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Whether you're attending an <span className="text-gray-900 font-semibold">expo, conference, exhibition, or professional training</span>, we provide comprehensive support services for individuals, organizations, and government officials to maximize your event experience.
                </p>
              </div>
            </div>

            {/* Right Side - Feature Cards */}
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="group bg-green-50 border border-green-100 rounded-xl p-5 hover:bg-green-100 hover:border-green-300 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Complete Event Support</h3>
                    <p className="text-sm text-gray-600">From registration to follow-up, we've got you covered</p>
                  </div>
                </div>
              </div>

              <div className="group bg-green-50 border border-green-100 rounded-xl p-5 hover:bg-green-100 hover:border-green-300 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Personalized Services</h3>
                    <p className="text-sm text-gray-600">Tailored solutions for your specific needs</p>
                  </div>
                </div>
              </div>

              <div className="group bg-green-50 border border-green-100 rounded-xl p-5 hover:bg-green-100 hover:border-green-300 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Expert Guidance</h3>
                    <p className="text-sm text-gray-600">Professional support at every step</p>
                  </div>
                </div>
              </div>

              <div className="group bg-green-50 border border-green-100 rounded-xl p-5 hover:bg-green-100 hover:border-green-300 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Seamless Experience</h3>
                    <p className="text-sm text-gray-600">Hassle-free event participation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      {/* Filters and Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 lg:sticky lg:top-6 space-y-4 md:space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base md:text-lg font-bold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-xs md:text-sm text-green-600 hover:text-green-700 font-semibold"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Format Filter */}
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3">Format</label>
                <div className="space-y-2">
                  {['all', 'online', 'offline', 'hybrid'].map(format => (
                    <label key={format} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="format"
                        value={format}
                        checked={selectedFormat === format}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-3 text-gray-700 capitalize text-sm md:text-base">{format === 'all' ? 'All Formats' : format}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3">Price</label>
                <div className="space-y-2">
                  {['all', 'free', 'paid'].map(price => (
                    <label key={price} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value={price}
                        checked={selectedPrice === price}
                        onChange={(e) => setSelectedPrice(e.target.value)}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-3 text-gray-700 capitalize text-sm md:text-base">{price === 'all' ? 'All Prices' : price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                >
                  <option value="date">Date</option>
                  <option value="price">Price</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 md:h-16 w-12 md:w-16 border-b-4 border-green-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 text-base md:text-lg">Loading amazing events...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600 text-base md:text-lg">Error: {error}</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl md:text-6xl mb-4">🔍</div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600 mb-6 text-sm md:text-base">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm md:text-base"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {filteredEvents.map((event) => {
                  const eventId = event._id || event.id;
                  const spotsLeft = event.maxCapacity && event.currentEnrollment !== undefined
                    ? event.maxCapacity - event.currentEnrollment
                    : null;

                  return (
                    <div
                      key={eventId}
                      className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                    >
                      {/* Image */}
                      <div className="relative h-40 md:h-48 overflow-hidden">
                        {event.imageUrl ? (
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                            <span className="text-4xl md:text-6xl">🎯</span>
                          </div>
                        )}

                        {/* Date Badge */}
                        {event.startDate && (
                          <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-white rounded-lg shadow-lg p-2 md:p-3 text-center">
                            <div className="text-xl md:text-2xl font-bold text-green-600">
                              {new Date(event.startDate).getDate()}
                            </div>
                            <div className="text-xs text-gray-600 uppercase">
                              {new Date(event.startDate).toLocaleDateString('en-GB', { month: 'short' })}
                            </div>
                          </div>
                        )}

                        {/* Price Badge */}
                        <div className="absolute top-3 md:top-4 right-3 md:right-4">
                          {event.price && event.price > 0 ? (
                            <span className="bg-amber-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold shadow-lg text-xs md:text-sm">
                              ${event.price}
                            </span>
                          ) : (
                            <span className="bg-green-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold shadow-lg text-xs md:text-sm">
                              FREE
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 md:p-6">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {event.format && (
                            <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold border ${getFormatColor(event.format)}`}>
                              {getFormatIcon(event.format)} {event.format.charAt(0).toUpperCase() + event.format.slice(1)}
                            </span>
                          )}
                          {event.category && (
                            <span className="px-2 md:px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                              {event.category}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {event.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-xs md:text-sm mb-4 line-clamp-2">
                          {event.description || 'No description available'}
                        </p>

                        {/* Event Details */}
                        <div className="space-y-2 mb-4 text-xs md:text-sm">
                          {event.startDate && (
                            <div className="flex items-center text-gray-700">
                              <span className="mr-2">🕐</span>
                              <span>{formatTime(event.startDate)}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center text-gray-700">
                              <span className="mr-2">📍</span>
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                          {spotsLeft !== null && (
                            <div className="flex items-center text-gray-700">
                              <span className="mr-2">👥</span>
                              <span>
                                {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Event full'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Capacity Progress Bar */}
                        {event.maxCapacity && event.currentEnrollment !== undefined && (
                          <div className="mb-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all"
                                style={{ width: `${(event.currentEnrollment / event.maxCapacity) * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {event.currentEnrollment} / {event.maxCapacity} registered
                            </p>
                          </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-2 md:gap-3">
                          <button
                            onClick={() => router.push(`/events/${eventId}`)}
                            className="flex-1 px-3 md:px-4 py-2 md:py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold text-xs md:text-sm"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleRegister(event)}
                            disabled={spotsLeft === 0}
                            className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
                          >
                            {spotsLeft === 0 ? 'Full' : 'Register'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
