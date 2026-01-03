'use client'

import { useState } from 'react'
import { Download, Calendar, BookOpen, TrendingUp } from 'lucide-react'


export default function EventsCoursesPage() {
  const [activeTab, setActiveTab] = useState('events')
  const [searchQuery, setSearchQuery] = useState('')

  const events = [
    {
      id: 1,
      title: 'Advanced Leadership Workshop',
      date: '2025-01-15',
      time: '10:00 AM - 4:00 PM',
      location: 'London Training Centre',
      registrations: 145,
      capacity: 200,
      status: 'Scheduled',
      category: 'Leadership'
    },
    {
      id: 2,
      title: 'Digital Marketing Masterclass',
      date: '2025-01-20',
      time: '2:00 PM - 5:00 PM',
      location: 'Virtual',
      registrations: 89,
      capacity: 150,
      status: 'Scheduled',
      category: 'Marketing'
    },
    {
      id: 3,
      title: 'Professional Development Conference',
      date: '2025-01-25',
      time: '9:00 AM - 5:30 PM',
      location: 'Manchester Convention Centre',
      registrations: 234,
      capacity: 500,
      status: 'Confirmed',
      category: 'Conference'
    },
    {
      id: 4,
      title: 'Compliance & Regulations Update',
      date: '2025-02-05',
      time: '11:00 AM - 12:30 PM',
      location: 'Virtual',
      registrations: 56,
      capacity: 100,
      status: 'Open',
      category: 'Compliance'
    },
  ]

  const courses = [
    {
      id: 1,
      title: 'Project Management Fundamentals',
      provider: 'Study Express UK',
      enrollments: 234,
      completion: 68,
      status: 'Active',
      duration: '8 weeks'
    },
    {
      id: 2,
      title: 'Data Analytics for Business',
      provider: 'Study Express UK',
      enrollments: 156,
      completion: 45,
      status: 'Active',
      duration: '6 weeks'
    },
    {
      id: 3,
      title: 'Advanced Excel Training',
      provider: 'Study Express UK',
      enrollments: 112,
      completion: 82,
      status: 'Active',
      duration: '4 weeks'
    },
    {
      id: 4,
      title: 'Communication Skills for Leaders',
      provider: 'Study Express UK',
      enrollments: 98,
      completion: 55,
      status: 'Scheduled',
      duration: '5 weeks'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Events & Training Courses</h1>
          <p className="text-slate-600 mt-1">Monitor all events and courses, view registrations and progress</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'events'
                ? 'bg-slate-50 text-slate-900 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Events
            </div>
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'courses'
                ? 'bg-slate-50 text-slate-900 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              Courses
            </div>
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'events' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none"
              />

              <div className="space-y-3">
                {events.map((event) => {
                  const occupancy = (event.registrations / event.capacity) * 100
                  return (
                    <div key={event.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900">{event.title}</h3>
                              <p className="text-sm text-slate-600 mt-1">{event.date} | {event.time}</p>
                              <p className="text-xs text-slate-500 mt-1">{event.location}</p>
                              <div className="flex items-center gap-4 mt-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  event.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                                  event.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                  'bg-purple-100 text-purple-700'
                                }`}>
                                  {event.status}
                                </span>
                                <span className="text-xs text-slate-600">{event.category}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">{event.registrations}/{event.capacity}</p>
                          <p className="text-xs text-slate-600 mt-1">Registrations</p>
                          <div className="w-32 h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                            <div
                              className="h-full bg-blue-600 transition-all"
                              style={{ width: `${occupancy}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{occupancy.toFixed(0)}% Full</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none"
              />

              <div className="grid grid-cols-1 gap-4">
                {courses.map((course) => (
                  <div key={course.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <BookOpen className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{course.title}</h3>
                            <p className="text-sm text-slate-600 mt-1">{course.provider}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="text-xs text-slate-600">{course.duration}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                course.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {course.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{course.enrollments}</p>
                        <p className="text-xs text-slate-600 mt-1">Enrollments</p>
                        <div className="flex items-center gap-2 mt-3">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-slate-900">{course.completion}%</span>
                        </div>
                        <p className="text-xs text-slate-600">Completion</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
