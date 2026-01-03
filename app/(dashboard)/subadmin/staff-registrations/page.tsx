'use client'

import { useState } from 'react'
import { Clock, CheckCircle, XCircle, UserPlus, Download } from 'lucide-react'

import { SubAdminStaffApprovalList, SubAdminStaffStats } from '@/components/subadmin'

export default function StaffRegistrationsPage() {
  const [filterStatus, setFilterStatus] = useState('pending')
  const [searchQuery, setSearchQuery] = useState('')

  const staffRegistrations = [
    {
      id: 1,
      name: 'Michael Chen',
      company: 'Tech Industries Ltd',
      email: 'michael.chen@techindustries.com',
      phone: '+44 7700 234567',
      role: 'Training Manager',
      registeredDate: '2024-12-28',
      status: 'pending',
      avatar: 'MC'
    },
    {
      id: 2,
      name: 'Lisa Anderson',
      company: 'Tech Industries Ltd',
      email: 'lisa.anderson@techindustries.com',
      phone: '+44 7700 345678',
      role: 'HR Specialist',
      registeredDate: '2024-12-27',
      status: 'pending',
      avatar: 'LA'
    },
    {
      id: 3,
      name: 'Robert Thompson',
      company: 'Global Consulting Group',
      email: 'r.thompson@globalconsulting.com',
      phone: '+44 7700 456789',
      role: 'Learning Lead',
      registeredDate: '2024-12-26',
      status: 'pending',
      avatar: 'RT'
    },
    {
      id: 4,
      name: 'Sophie Martin',
      company: 'Tech Industries Ltd',
      email: 'sophie.martin@techindustries.com',
      phone: '+44 7700 567890',
      role: 'Course Coordinator',
      registeredDate: '2024-12-25',
      status: 'approved',
      avatar: 'SM'
    },
    {
      id: 5,
      name: 'David Brown',
      company: 'Innovation Labs',
      email: 'david.brown@innovationlabs.com',
      phone: '+44 7700 678901',
      role: 'Development Manager',
      registeredDate: '2024-12-24',
      status: 'rejected',
      avatar: 'DB'
    },
  ]

  const stats = [
    { label: 'Pending Approvals', value: '23', color: 'from-amber-500 to-amber-600', icon: Clock },
    { label: 'Approved Staff', value: '156', color: 'from-green-500 to-green-600', icon: CheckCircle },
    { label: 'Rejected', value: '5', color: 'from-red-500 to-red-600', icon: XCircle },
    { label: 'Total Registered', value: '184', color: 'from-blue-500 to-blue-600', icon: UserPlus },
  ]

  const filteredRegistrations = staffRegistrations.filter(staff => {
    const matchesStatus = filterStatus === 'all' || staff.status === filterStatus
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.company.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Staff Registration Approvals</h1>
          <p className="text-slate-600 mt-1">Review and approve corporate staff member registrations</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 text-white/20" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'pending'
                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Pending (23)
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'approved'
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'rejected'
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Rejected
          </button>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All
          </button>

          <div className="flex-1 flex items-center justify-end">
            <input
              type="text"
              placeholder="Search by name or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1 text-sm border border-slate-200 rounded-lg outline-none"
            />
          </div>
        </div>
      </div>

      {/* Registrations List */}
      <div className="space-y-3">
        {filteredRegistrations.map((staff) => (
          <div key={staff.id} className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                  {staff.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{staff.name}</h3>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      staff.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      staff.status === 'approved' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{staff.role} at {staff.company}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>{staff.email}</span>
                    <span>{staff.phone}</span>
                    <span>Registered: {staff.registeredDate}</span>
                  </div>
                </div>
              </div>

              {staff.status === 'pending' && (
                <div className="flex items-center gap-2 ml-4">
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRegistrations.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">No registrations found</p>
        </div>
      )}
    </div>
  )
}
