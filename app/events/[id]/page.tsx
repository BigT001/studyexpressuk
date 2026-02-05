'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Event {
    _id: string;
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
    status: string;
}

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [registering, setRegistering] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`/api/events/${params.id}`);
                const data = await response.json();

                if (data.success) {
                    setEvent(data.event);
                } else {
                    setError(data.error || 'Failed to load event');
                }
            } catch (err) {
                setError('Failed to load event');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchEvent();
        }
    }, [params.id]);

    const handleRegister = async () => {
        if (status !== 'authenticated') {
            router.push('/auth/signin');
            return;
        }

        if (!event) return;

        setRegistering(true);
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

            // Handle free registration
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
        } finally {
            setRegistering(false);
        }
    };

    const formatDate = (date?: string) => {
        if (!date) return 'TBA';
        return new Date(date).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (date?: string) => {
        if (!date) return '';
        return new Date(date).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading event details...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
                    <p className="text-gray-600 mb-4">{error || 'This event does not exist'}</p>
                    <button
                        onClick={() => router.push('/events')}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    const spotsLeft = event.maxCapacity && event.currentEnrollment !== undefined
        ? event.maxCapacity - event.currentEnrollment
        : null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => router.push('/events')}
                        className="mb-6 flex items-center text-white hover:text-green-100 transition-colors"
                    >
                        ← Back to Events
                    </button>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="flex gap-2 mb-4 flex-wrap">
                                {event.category && (
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                                        {event.category}
                                    </span>
                                )}
                                {event.format && (
                                    <span className="px-3 py-1 bg-blue-500 rounded-full text-sm font-semibold">
                                        {event.format === 'online' ? '🌐 Online' : event.format === 'offline' ? '📍 Offline' : '🔄 Hybrid'}
                                    </span>
                                )}
                                {event.access && (
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${event.access === 'premium' ? 'bg-amber-500' : event.access === 'corporate' ? 'bg-blue-600' : 'bg-emerald-500'
                                        }`}>
                                        {event.access === 'premium' ? '💎 Premium' : event.access === 'corporate' ? '🏢 Corporate' : '🆓 Free'}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
                            {event.startDate && (
                                <div className="text-lg text-green-100">
                                    <p>📅 {formatDate(event.startDate)}</p>
                                    <p>🕐 {formatTime(event.startDate)}</p>
                                </div>
                            )}
                        </div>
                        <div className="relative h-64 rounded-lg overflow-hidden shadow-xl">
                            {event.imageUrl ? (
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                    <span className="text-6xl">🎯</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                            <p className="text-gray-700 leading-relaxed">
                                {event.description || 'No description available for this event.'}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Details</h2>
                            <div className="space-y-4">
                                {event.startDate && (
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">📅</span>
                                        <div>
                                            <p className="text-sm text-gray-500">Start Date</p>
                                            <p className="font-semibold text-gray-900">{formatDate(event.startDate)}</p>
                                            <p className="text-sm text-gray-600">{formatTime(event.startDate)}</p>
                                        </div>
                                    </div>
                                )}
                                {event.endDate && (
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">🏁</span>
                                        <div>
                                            <p className="text-sm text-gray-500">End Date</p>
                                            <p className="font-semibold text-gray-900">{formatDate(event.endDate)}</p>
                                            <p className="text-sm text-gray-600">{formatTime(event.endDate)}</p>
                                        </div>
                                    </div>
                                )}
                                {event.location && (
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">📍</span>
                                        <div>
                                            <p className="text-sm text-gray-500">Location</p>
                                            <p className="font-semibold text-gray-900">{event.location}</p>
                                        </div>
                                    </div>
                                )}
                                {event.format && (
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">💻</span>
                                        <div>
                                            <p className="text-sm text-gray-500">Format</p>
                                            <p className="font-semibold text-gray-900">
                                                {event.format.charAt(0).toUpperCase() + event.format.slice(1)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {event.maxCapacity && (
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">👥</span>
                                        <div>
                                            <p className="text-sm text-gray-500">Capacity</p>
                                            <p className="font-semibold text-gray-900">
                                                {event.currentEnrollment || 0} / {event.maxCapacity} registered
                                            </p>
                                            {spotsLeft !== null && spotsLeft > 0 && (
                                                <p className="text-sm text-green-600">{spotsLeft} spots left!</p>
                                            )}
                                            {spotsLeft === 0 && (
                                                <p className="text-sm text-red-600">Event is full</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-500 mb-2">Registration Fee</p>
                                <p className="text-4xl font-bold text-green-600">
                                    {event.price ? `$${event.price}` : 'Free'}
                                </p>
                            </div>
                            <button
                                onClick={handleRegister}
                                disabled={registering || (spotsLeft !== null && spotsLeft <= 0)}
                                className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {registering ? 'Processing...' : spotsLeft === 0 ? 'Event Full' : 'Register Now'}
                            </button>
                            {spotsLeft !== null && spotsLeft > 0 && spotsLeft <= 10 && (
                                <p className="text-xs text-red-600 text-center mt-2 font-semibold">
                                    Only {spotsLeft} spots remaining!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
