'use client'

import { useState } from 'react'
import { Download, Search, Filter, Eye, Users2 } from 'lucide-react'

import { SubAdminMemberSearch, SubAdminMemberList, SubAdminMemberFilters } from '@/components/subadmin'

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [memberType, setMemberType] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)

  const memberStats = [
    { label: 'Individual Members', value: '1,850', change: '+24 this month' },
    { label: 'Corporate Members', value: '600', change: '+8 this month' },
    { label: 'Active Members', value: '2,200', change: '89.8% engagement' },
    { label: 'Inactive Members', value: '250', change: 'Needs attention' },
  ]

  const members = [
    {
      id: 1,
      name: 'Sarah Johnson',
      type: 'Individual',
      email: 'sarah.johnson@email.com',
      phone: '+44 7700 123456',
      joinDate: '2024-06-15',
      status: 'Active',
      courses: 3,
      lastLogin: '2 hours ago',
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Tech Industries Ltd',
      type: 'Corporate',
      email: 'hr@techindustries.com',
      phone: '+44 20 7946 0958',
      joinDate: '2024-03-10',
      status: 'Active',
      staff: 45,
      lastLogin: '1 day ago',
      avatar: 'TI'
    },
    {
      id: 3,
      name: 'James Wilson',
      type: 'Individual',
      email: 'james.wilson@email.com',
      phone: '+44 7700 654321',
      joinDate: '2024-08-22',
      status: 'Active',
      courses: 1,
      lastLogin: '5 days ago',
      avatar: 'JW'
    },
    {
      id: 4,
      name: 'Global Consulting Group',
      type: 'Corporate',
      email: 'contact@globalconsulting.com',
      phone: '+44 20 3031 1234',
      joinDate: '2024-02-05',
      status: 'Inactive',
      staff: 120,
      lastLogin: '3 weeks ago',
      avatar: 'GC'
    },
    {
      id: 5,
      name: 'Emma Davis',
      type: 'Individual',
      email: 'emma.davis@email.com',
      phone: '+44 7700 987654',
      joinDate: '2024-07-08',
      status: 'Active',
      courses: 2,
      lastLogin: '12 hours ago',
      avatar: 'ED'
    },
  ]

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = memberType === 'all' || member.type.toLowerCase() === memberType.toLowerCase()
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Member Management</h1>
          <p className="text-slate-600 mt-1">View and manage all individual and corporate member profiles</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {memberStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-sm text-slate-600">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
        <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent flex-1 outline-none text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filters</span>
          </button>

          <select
            value={memberType}
            onChange={(e) => setMemberType(e.target.value)}
            className="text-sm border border-slate-200 rounded px-3 py-1 outline-none"
          >
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="corporate">Corporate</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-slate-200 rounded px-3 py-1 outline-none ml-auto"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Join Date</option>
            <option value="activity">Sort by Activity</option>
          </select>
        </div>

        {showFilters && <SubAdminMemberFilters />}
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Member</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Activity</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{member.name}</p>
                        <p className="text-xs text-slate-600">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      member.type === 'Individual' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {member.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{member.joinDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      member.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{member.lastLogin}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-700 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="p-8 text-center">
            <Users2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No members found matching your search criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">Showing {filteredMembers.length} of {members.length} members</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-slate-200 rounded text-sm hover:bg-slate-50 transition-colors">Previous</button>
          <button className="px-3 py-1 border border-slate-200 rounded text-sm hover:bg-slate-50 transition-colors">Next</button>
        </div>
      </div>
    </div>
  )
}
