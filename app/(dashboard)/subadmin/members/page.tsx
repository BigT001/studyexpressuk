'use client'

import { useState, useEffect } from 'react'
import { Download, Search, Filter, Eye, Users2, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [memberType, setMemberType] = useState('all')
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredMembers = users.filter(user => {
    const name = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const email = (user.email || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = name.includes(query) || email.includes(query);
    const matchesType = memberType === 'all' || user.role === memberType.toUpperCase();
    
    return matchesSearch && matchesType;
  })

  const stats = {
    individuals: users.filter(u => u.role === 'INDIVIDUAL').length,
    corporates: users.filter(u => u.role === 'CORPORATE').length,
    staff: users.filter(u => u.role === 'STAFF').length,
    total: users.length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Member Management</h1>
          <p className="text-slate-600 mt-1">View and manage all individual and corporate member profiles</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Individual Members', value: stats.individuals, color: 'text-blue-600' },
          { label: 'Corporate Members', value: stats.corporates, color: 'text-purple-600' },
          { label: 'Staff Members', value: stats.staff, color: 'text-green-600' },
          { label: 'Total Members', value: stats.total, color: 'text-slate-900' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <p className={`text-2xl font-black mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100 focus-within:border-blue-300 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent flex-1 outline-none text-sm text-slate-700"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {['all', 'individual', 'corporate', 'staff'].map((type) => (
              <button
                key={type}
                onClick={() => setMemberType(type)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-tighter ${
                  memberType === type 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors ml-auto"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-semibold">More Filters</span>
          </button>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-slate-500 font-medium">Loading member directory...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Member</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Joined</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white text-sm font-black shadow-inner">
                          {member.profileImage ? (
                            <img src={member.profileImage} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            (member.firstName?.[0] || member.email?.[0] || '?').toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{member.firstName} {member.lastName}</p>
                          <p className="text-xs text-slate-500 font-medium">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                        member.role === 'INDIVIDUAL' 
                          ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                          : member.role === 'CORPORATE'
                          ? 'bg-purple-50 text-purple-600 border border-purple-100'
                          : 'bg-green-50 text-green-600 border border-green-100'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                        member.status === 'active' || member.status === 'subscribed'
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {member.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/subadmin/messages?user=${member._id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all inline-block"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredMembers.length === 0 && (
          <div className="p-20 text-center">
            <Users2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No members found matching your search</p>
          </div>
        )}
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Showing {filteredMembers.length} of {users.length} members
        </p>
      </div>
    </div>
  )
}

import { MessageSquare } from 'lucide-react'
