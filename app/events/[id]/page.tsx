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
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Image Section - Full Width */}
            <div className="relative h-[60vh] min-h-[400px] w-full bg-gray-900">
                {event.imageUrl ? (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover opacity-60"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-800 to-gray-900 opacity-80" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

                {/* Hero Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                    <div className="max-w-7xl mx-auto">
                        <button
                            onClick={() => router.push('/events')}
                            className="mb-6 flex items-center text-white/80 hover:text-white transition-colors text-sm font-medium uppercase tracking-wide"
                        >
                            ← Back to Events
                        </button>

                        <div className="flex flex-wrap gap-3 mb-6">
                            {event.category && (
                                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                                    {event.category}
                                </span>
                            )}
                            {event.format && (
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-bold uppercase tracking-wider border border-white/30">
                                    {event.format}
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight max-w-4xl">
                            {event.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base font-medium">
                            {event.startDate && (
                                <div className="flex items-center gap-2">
                                    <span className="text-green-400">📅</span>
                                    {formatDate(event.startDate)}
                                </div>
                            )}
                            {event.location && (
                                <div className="flex items-center gap-2">
                                    <span className="text-green-400">📍</span>
                                    {event.location}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content - Blog Style */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Overview Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <span className="w-8 h-1 bg-green-500 rounded-full block"></span>
                                About this Event
                            </h2>
                            <div className="prose prose-lg prose-green max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                                {event.description || 'No description available for this event.'}
                            </div>
                        </div>

                        {/* Additional Info / Schedule (Placeholder if no data structure yet) */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <span className="w-8 h-1 bg-green-500 rounded-full block"></span>
                                Event Highlights
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                                        🎓
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">Networking</h3>
                                        <p className="text-gray-600 text-sm">Connect with industry leaders and like-minded professionals.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                                        💡
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">Expert Insights</h3>
                                        <p className="text-gray-600 text-sm">Gain valuable knowledge from top experts in the field.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                                        📜
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">Certification</h3>
                                        <p className="text-gray-600 text-sm">Receive a certificate of participation upon completion.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                                        🤝
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">Community</h3>
                                        <p className="text-gray-600 text-sm">Join a vibrant community of learners and professionals.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Sticky */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Registration Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-8 border-green-500">
                                <div className="text-center mb-8">
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Registration Fee</p>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-5xl font-black text-gray-900">
                                            {event.price ? `$${event.price}` : 'Free'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    {event.startDate && (
                                        <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Date</span>
                                            <span className="font-bold text-gray-900 text-right">{formatDate(event.startDate)}</span>
                                        </div>
                                    )}
                                    {event.startDate && (
                                        <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Time</span>
                                            <span className="font-bold text-gray-900 text-right">{formatTime(event.startDate)}</span>
                                        </div>
                                    )}
                                    {event.maxCapacity && (
                                        <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Availability</span>
                                            <span className={`font-bold text-right ${spotsLeft !== null && spotsLeft < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                                {spotsLeft !== null ? `${spotsLeft} spots left` : 'Open'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleRegister}
                                    disabled={registering || (spotsLeft !== null && spotsLeft <= 0)}
                                    className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {registering ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : spotsLeft === 0 ? 'Event Full' : 'Register Now'}
                                </button>

                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Secure payment powered by Stripe
                                </p>
                            </div>

                            {/* Organizer / Contact (Optional) */}
                            <div className="bg-gray-100 rounded-2xl p-6">
                                <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Contact our support team for any questions regarding this event.
                                </p>
                                <a href="mailto:support@studyexpressuk.com" className="text-green-600 font-bold text-sm hover:underline">
                                    Contact Support →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
