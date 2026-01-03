'use client';

import { useState } from 'react';

export default function CorporateCoursesPage() {
  const [courseEnrollments] = useState([
    {
      id: 1,
      title: 'Advanced TypeScript Mastery',
      category: 'Development',
      staff: 8,
      completed: 3,
      inProgress: 5,
      progress: 65,
      startDate: 'Jan 10, 2024',
      dueDate: 'Mar 10, 2024',
    },
    {
      id: 2,
      title: 'Leadership Excellence',
      category: 'Management',
      staff: 12,
      completed: 4,
      inProgress: 8,
      progress: 45,
      startDate: 'Feb 1, 2024',
      dueDate: 'Apr 1, 2024',
    },
    {
      id: 3,
      title: 'Cloud Architecture Fundamentals',
      category: 'Infrastructure',
      staff: 5,
      completed: 5,
      inProgress: 0,
      progress: 100,
      startDate: 'Dec 15, 2023',
      dueDate: 'Feb 15, 2024',
    },
  ]);

  const [staffProgress] = useState([
    {
      id: 1,
      name: 'John Smith',
      coursesEnrolled: 3,
      coursesCompleted: 2,
      averageProgress: 78,
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      coursesEnrolled: 2,
      coursesCompleted: 1,
      averageProgress: 55,
      lastActive: '1 day ago',
    },
    {
      id: 3,
      name: 'Michael Chen',
      coursesEnrolled: 4,
      coursesCompleted: 3,
      averageProgress: 88,
      lastActive: '30 minutes ago',
    },
  ]);

  const [availableCourses] = useState([
    {
      id: 1,
      title: 'Project Management Professional',
      provider: 'StudyExpressUK',
      category: 'Management',
      duration: '4 weeks',
      level: 'Intermediate',
      price: '$299',
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Data Analytics Fundamentals',
      provider: 'StudyExpressUK',
      category: 'Data Science',
      duration: '6 weeks',
      level: 'Beginner',
      price: '$249',
      rating: 4.7,
    },
    {
      id: 3,
      title: 'Cybersecurity Essentials',
      provider: 'StudyExpressUK',
      category: 'Security',
      duration: '5 weeks',
      level: 'Intermediate',
      price: '$349',
      rating: 4.9,
    },
  ]);

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Training & Courses</h1>
        <p className="text-gray-600 mt-1">Manage staff enrollment and monitor learning progress</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <span className="text-4xl mb-3 block">📚</span>
          <p className="text-gray-600 text-sm font-medium">Active Courses</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{courseEnrollments.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <span className="text-4xl mb-3 block">👥</span>
          <p className="text-gray-600 text-sm font-medium">Staff Enrolled</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {courseEnrollments.reduce((sum, c) => sum + c.staff, 0)}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <span className="text-4xl mb-3 block">🏆</span>
          <p className="text-gray-600 text-sm font-medium">Completed</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {courseEnrollments.reduce((sum, c) => sum + c.completed, 0)}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <span className="text-4xl mb-3 block">📈</span>
          <p className="text-gray-600 text-sm font-medium">Avg. Progress</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {Math.round(
              courseEnrollments.reduce((sum, c) => sum + c.progress, 0) / courseEnrollments.length
            )}%
          </p>
        </div>
      </div>

      {/* Active Course Enrollments */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Active Course Enrollments</h2>
          <p className="text-gray-600 mt-1">Courses your organization is currently using</p>
        </div>

        <div className="divide-y divide-gray-200">
          {courseEnrollments.map((course) => (
            <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{course.category} • Started {course.startDate}</p>

                  <div className="mt-4 flex items-center gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Staff Enrolled</p>
                      <p className="text-xl font-bold text-gray-900">{course.staff}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-xl font-bold text-gray-900">{course.completed}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">In Progress</p>
                      <p className="text-xl font-bold text-gray-900">{course.inProgress}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                      <span className="text-sm font-bold text-gray-900">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-4">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Learning Progress */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Staff Learning Progress</h2>
          <p className="text-gray-600 mt-1">Individual staff member performance tracking</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Staff Member</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Enrolled</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Completed</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Progress</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {staffProgress.map((staff, idx) => (
                <tr key={staff.id} className={`border-b border-gray-100 ${idx % 2 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{staff.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{staff.coursesEnrolled}</td>
                  <td className="px-6 py-4 text-gray-900">{staff.coursesCompleted}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${staff.averageProgress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{staff.averageProgress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{staff.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Courses to Assign */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Available Courses</h2>
          <p className="text-gray-600 mt-1">Browse and assign new courses to your staff</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableCourses.map((course) => (
            <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-32 flex items-center justify-center">
                <span className="text-5xl opacity-50">📚</span>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-lg">{course.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{course.provider}</p>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <span>{course.category}</span>
                  <span>⭐ {course.rating}</span>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                  <span>{course.duration}</span>
                  <span>{course.level}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{course.price}</span>
                    <button className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-1">
                      <span>▶️</span>
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
