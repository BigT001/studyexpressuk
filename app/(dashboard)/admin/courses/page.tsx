'use client';

import { useState, useEffect } from 'react';
import CloudinaryUpload from '@/components/CloudinaryUpload';

interface Course {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number; // in hours
  price?: number;
  imageUrl?: string;
  instructor?: string;
  enrolledCount?: number;
  status: 'draft' | 'published' | 'active' | 'archived';
  createdAt: string;
}

interface Stats {
  total: number;
  published: number;
  enrolled: number;
  revenue: number;
}

type ModalMode = 'create' | 'edit' | null;

export default function CoursesManagementPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    duration: '',
    price: '',
    instructor: '',
    status: 'draft' as 'draft' | 'published' | 'active' | 'archived',
    imageUrl: '',
  });
  const [stats, setStats] = useState<Stats>({
    total: 0,
    published: 0,
    enrolled: 0,
    revenue: 0,
  });

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Mock data for now - replace with real API call
        const mockCourses: Course[] = [];
        setCourses(mockCourses);
        calculateStats(mockCourses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Calculate stats
  const calculateStats = (courseList: Course[]) => {
    const total = courseList.length;
    const published = courseList.filter(c => c.status === 'published' || c.status === 'active').length;
    const enrolled = courseList.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);
    const revenue = courseList.reduce((sum, c) => sum + (c.price || 0) * (c.enrolledCount || 0), 0);

    setStats({ total, published, enrolled, revenue });
  };

  // Filter courses
  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, statusFilter]);

  // Handle create course
  const handleCreateCourse = async () => {
    try {
      // API call would go here
      console.log('Creating course:', formData);
      resetModal();
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  // Handle edit course
  const handleEditCourse = async () => {
    if (!selectedCourse) return;
    try {
      // API call would go here
      console.log('Updating course:', formData);
      resetModal();
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  // Reset modal
  const resetModal = () => {
    setModalMode(null);
    setSelectedCourse(null);
    setImagePreview('');
    setFormData({
      title: '',
      description: '',
      category: '',
      level: 'beginner',
      duration: '',
      price: '',
      instructor: '',
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
  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      category: course.category || '',
      level: course.level || 'beginner',
      duration: course.duration?.toString() || '',
      price: course.price?.toString() || '',
      instructor: course.instructor || '',
      status: course.status,
      imageUrl: course.imageUrl || '',
    });
    setImagePreview(course.imageUrl || '');
    setModalMode('edit');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'published':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-emerald-100 text-emerald-800';
      case 'intermediate':
        return 'bg-amber-100 text-amber-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Courses Management</h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">Create and manage educational courses</p>
          </div>
          <div className="flex gap-3">
            <input
              type="search"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 md:flex-none md:w-64"
            />
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
            >
              + New Course
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-blue-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Total Courses</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mt-1 sm:mt-2">{stats.total}</p>
          </div>
          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-green-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Published</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mt-1 sm:mt-2">{stats.published}</p>
          </div>
          <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-purple-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Enrollments</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 mt-1 sm:mt-2">{stats.enrolled}</p>
          </div>
          <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-amber-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Revenue</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-600 mt-1 sm:mt-2">${stats.revenue.toFixed(0)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading courses...</div>
          ) : filteredCourses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {courses.length === 0 ? 'No courses created yet' : 'No courses match your filters'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={course._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
                  {/* Image */}
                  {course.imageUrl && (
                    <div className="relative w-full h-40 overflow-hidden bg-gray-200">
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{course.title}</h3>
                    {course.category && (
                      <p className="text-xs text-gray-600 mt-1">{course.category}</p>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-4">
                    {course.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                    )}

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(course.status)}`}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </span>
                      {course.level && (
                        <span className={`inline-flex text-xs font-semibold px-3 py-1 rounded-full border ${getLevelColor(course.level)}`}>
                          {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-2 pt-2 border-t border-gray-200">
                      {course.duration && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-semibold text-gray-900">{course.duration}h</span>
                        </div>
                      )}
                      {course.price && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-semibold text-gray-900">${course.price}</span>
                        </div>
                      )}
                      {course.enrolledCount !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Enrolled:</span>
                          <span className="font-semibold text-gray-900">{course.enrolledCount}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3">
                    <button
                      onClick={() => openEditModal(course)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => { /* delete handler */ }}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {(modalMode === 'create' || modalMode === 'edit') && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={resetModal}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {modalMode === 'create' ? 'Create New Course' : 'Edit Course'}
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
                  folder="courses"
                  onUploadSuccess={(url) => setFormData({ ...formData, imageUrl: url })}
                  currentImage={imagePreview}
                  label="Course Image"
                  buttonText="📸 Click to upload course image"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter course title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Programming, Design, Business"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter course description"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
                    <input
                      type="text"
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      placeholder="Instructor name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 20"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g., 99.99"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                      <option value="archived">Archived</option>
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
                    onClick={modalMode === 'create' ? handleCreateCourse : handleEditCourse}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {modalMode === 'create' ? 'Create Course' : 'Save Changes'}
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
