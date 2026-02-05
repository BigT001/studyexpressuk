'use client';

import { useState, useEffect } from 'react';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import EventCard from '@/components/admin/EventCard';

interface Event {
  _id: string;
  title: string;
  description?: string;
  type: 'event' | 'course';
  category?: string;
  access: 'free' | 'premium' | 'corporate';
  format?: 'online' | 'offline' | 'hybrid';
  startDate?: string;
  endDate?: string;
  maxCapacity?: number;
  currentEnrollment?: number;
  location?: string;
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  featured?: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  active: number;
  published: number;
  drafted: number;
}

interface Permission {
  role: 'INDIVIDUAL' | 'CORPORATE' | 'SUB_ADMIN' | 'ADMIN';
  canRegister: boolean;
  canView: boolean;
}

type ModalMode = 'create' | 'edit' | 'permissions' | null;

export default function EventsManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [accessFilter, setAccessFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    access: 'free' as 'free' | 'premium' | 'corporate',
    format: '' as 'online' | 'offline' | 'hybrid' | '',
    startDate: '',
    endDate: '',
    maxCapacity: '',
    location: '',
    status: 'draft' as 'draft' | 'published' | 'active' | 'completed' | 'cancelled',
    imageUrl: '',
  });
  const [permissions, setPermissions] = useState<Permission[]>([
    { role: 'INDIVIDUAL', canRegister: true, canView: true },
    { role: 'CORPORATE', canRegister: false, canView: false },
    { role: 'SUB_ADMIN', canRegister: true, canView: true },
    { role: 'ADMIN', canRegister: true, canView: true },
  ]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    published: 0,
    drafted: 0,
  });

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/events');
        const data = await res.json();
        console.log('===== FETCH EVENTS =====');
        console.log('Raw API response:', data);
        if (data.success) {
          console.log('Events fetched:', data.events);
          console.log('Sample event format field:', data.events[0]?.format);
          setEvents(data.events);
          calculateStats(data.events);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Calculate stats
  const calculateStats = (eventList: Event[]) => {
    const total = eventList.length;
    const active = eventList.filter(e => e.status === 'active').length;
    const published = eventList.filter(e => e.status === 'published').length;
    const drafted = eventList.filter(e => e.status === 'draft').length;

    setStats({ total, active, published, drafted });
  };

  // Filter events
  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => e.status === statusFilter);
    }

    if (accessFilter !== 'all') {
      filtered = filtered.filter(e => e.access === accessFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter, accessFilter]);

  // Handle create event
  const handleCreateEvent = async () => {
    try {
      const payload: any = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        access: formData.access,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity) : undefined,
        location: formData.location,
        status: formData.status,
        imageUrl: formData.imageUrl,
      };
      // Only include format if it's not empty
      if (formData.format) {
        payload.format = formData.format;
      }
      console.log('===== CREATE EVENT =====');
      console.log('Form data format:', formData.format);
      console.log('Sending payload to API:', payload);

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log('API Response:', data);
      console.log('Saved event format in response:', data.event?.format);

      if (data.success) {
        console.log('Event created successfully, adding to state');
        setEvents([data.event, ...events]);
        resetModal();
        alert('Event created successfully!');
      } else {
        alert(`Error: ${data.error || 'Failed to create event'}`);
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      alert(`Error creating event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Handle edit event
  const handleEditEvent = async () => {
    if (!selectedEvent) return;
    try {
      const payload: any = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        access: formData.access,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity) : undefined,
        location: formData.location,
        status: formData.status,
        imageUrl: formData.imageUrl,
      };
      // Only include format if it's not empty
      if (formData.format) {
        payload.format = formData.format;
      }
      console.log('Sending update payload:', payload);
      const res = await fetch(`/api/events/${selectedEvent._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log('Update response:', data);
      if (data.success) {
        // Update local state with the new data
        setEvents(events.map(e => e._id === selectedEvent._id ? { ...e, ...data.event } : e));
        setFilteredEvents(filteredEvents.map(e => e._id === selectedEvent._id ? { ...e, ...data.event } : e));
        resetModal();
        alert('Event updated successfully!');
      } else {
        alert(`Error: ${data.error || 'Failed to update event'}`);
      }
    } catch (error) {
      console.error('Failed to update event:', error);
      alert(`Error updating event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Handle delete event
  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (data.success) {
        // Remove from state
        setEvents(events.filter(e => e._id !== eventId));
        setFilteredEvents(filteredEvents.filter(e => e._id !== eventId));
        alert(`Event "${eventTitle}" deleted successfully!`);
      } else {
        alert(`Error: ${data.error || 'Failed to delete event'}`);
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert(`Error deleting event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Reset modal
  const resetModal = () => {
    setModalMode(null);
    setSelectedEvent(null);
    setImagePreview('');
    setFormData({
      title: '',
      description: '',
      category: '',
      access: 'free',
      format: '',
      startDate: '',
      endDate: '',
      maxCapacity: '',
      location: '',
      status: 'draft',
      imageUrl: '',
    });
  };

  // Open create modal
  const openCreateModal = () => {
    resetModal();
    setModalMode('create');
  };

  // Open edit modal
  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    const eventFormat = event.format || '';
    console.log('Editing event:', event);
    console.log('Event format from DB:', event.format);
    setFormData({
      title: event.title,
      description: event.description || '',
      category: event.category || '',
      access: event.access,
      format: eventFormat as 'online' | 'offline' | 'hybrid' | '',
      startDate: event.startDate?.split('T')[0] || '',
      endDate: event.endDate?.split('T')[0] || '',
      maxCapacity: event.maxCapacity?.toString() || '',
      location: event.location || '',
      status: event.status,
      imageUrl: event.imageUrl || '',
    });
    setImagePreview(event.imageUrl || '');
    setModalMode('edit');
  };

  // Open permissions modal
  const openPermissionsModal = (event: Event) => {
    setSelectedEvent(event);
    setModalMode('permissions');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'published':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header with Create Button */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Events Management</h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">Create, publish, and manage all platform events</p>
          </div>
          <div className="flex gap-3">
            <input
              type="search"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 md:flex-none md:w-64"
            />
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
            >
              + New Event
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-blue-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Total Events</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mt-1 sm:mt-2">{stats.total}</p>
          </div>
          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-green-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Active</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mt-1 sm:mt-2">{stats.active}</p>
          </div>
          <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-purple-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Published</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 mt-1 sm:mt-2">{stats.published}</p>
          </div>
          <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-amber-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Drafts</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-600 mt-1 sm:mt-2">{stats.drafted}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
              <select
                value={accessFilter}
                onChange={(e) => setAccessFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Access Levels</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {events.length === 0 ? 'No events created yet' : 'No events match your filters'}
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event._id} className="break-inside-avoid mb-6">
                  <EventCard
                    key={event._id}
                    _id={event._id}
                    title={event.title}
                    description={event.description}
                    category={event.category}
                    status={event.status}
                    access={event.access}
                    format={event.format}
                    startDate={event.startDate}
                    location={event.location}
                    currentEnrollment={event.currentEnrollment}
                    maxCapacity={event.maxCapacity}
                    imageUrl={event.imageUrl}
                    onEdit={() => openEditModal(event)}
                    onPermissions={() => openPermissionsModal(event)}
                    onDelete={() => handleDeleteEvent(event._id, event.title)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create/Edit Event Modal */}
        {(modalMode === 'create' || modalMode === 'edit') && (
          <div
            className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={resetModal}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {modalMode === 'create' ? 'Create New Event' : 'Edit Event'}
                </h2>
                <button
                  onClick={resetModal}
                  className="text-white hover:text-gray-200 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Image Upload */}
                <CloudinaryUpload
                  folder="events"
                  onUploadSuccess={(url) => setFormData({ ...formData, imageUrl: url })}
                  currentImage={imagePreview}
                  label="Event Image"
                  buttonText="📸 Click to upload event image"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter event title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Technology, Business, Education"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter event description"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Capacity</label>
                    <input
                      type="number"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                      placeholder="Leave blank for unlimited"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Physical location or 'Virtual'"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Format (Optional)</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select Format --</option>
                    <option value="online">🌐 Online</option>
                    <option value="offline">📍 Offline</option>
                    <option value="hybrid">🔄 Hybrid (Online + Offline)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                    <select
                      value={formData.access}
                      onChange={(e) => setFormData({ ...formData, access: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                      <option value="corporate">Corporate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={resetModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={modalMode === 'create' ? handleCreateEvent : handleEditEvent}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {modalMode === 'create' ? 'Create Event' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Permissions Modal */}
        {modalMode === 'permissions' && selectedEvent && (
          <div
            className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={resetModal}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-linear-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold text-white">Event Permissions</h2>
                <button
                  onClick={resetModal}
                  className="text-white hover:text-gray-200 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Event: {selectedEvent.title}</h3>
                  <p className="text-sm text-gray-600 mb-6">Configure who can view and register for this event</p>
                </div>

                {/* Permissions Table */}
                <div className="space-y-4">
                  {permissions.map((perm) => (
                    <div key={perm.role} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">
                          {perm.role === 'INDIVIDUAL' && '👤 Individual Users'}
                          {perm.role === 'CORPORATE' && '🏢 Corporate Accounts'}
                          {perm.role === 'SUB_ADMIN' && '👨‍💼 Sub Admins'}
                          {perm.role === 'ADMIN' && '🔐 Admins'}
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={perm.canView}
                            onChange={(e) => {
                              const updated = permissions.map(p =>
                                p.role === perm.role ? { ...p, canView: e.target.checked } : p
                              );
                              setPermissions(updated);
                            }}
                            className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                          />
                          <span className="text-sm text-gray-700">Can view event details</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={perm.canRegister}
                            onChange={(e) => {
                              const updated = permissions.map(p =>
                                p.role === perm.role ? { ...p, canRegister: e.target.checked } : p
                              );
                              setPermissions(updated);
                            }}
                            className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                          />
                          <span className="text-sm text-gray-700">Can register for event</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={resetModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={resetModal}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Save Permissions
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
