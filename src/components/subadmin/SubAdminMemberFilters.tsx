'use client'

import { Calendar, MapPin } from 'lucide-react'

export function SubAdminMemberFilters() {
  return (
    <div className="bg-slate-50 rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">Member Type</label>
          <select className="w-full text-sm border border-slate-200 rounded px-2 py-1 outline-none">
            <option>Individual</option>
            <option>Corporate</option>
            <option>All</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">Status</label>
          <select className="w-full text-sm border border-slate-200 rounded px-2 py-1 outline-none">
            <option>Active</option>
            <option>Inactive</option>
            <option>All</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">Join Date Range</label>
          <input type="date" className="w-full text-sm border border-slate-200 rounded px-2 py-1 outline-none" />
        </div>
      </div>
    </div>
  )
}
