'use client'

import { Search } from 'lucide-react'

export function SubAdminMemberSearch() {
  return (
    <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
      <Search className="w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder="Search members..."
        className="bg-transparent flex-1 outline-none text-sm"
      />
    </div>
  )
}
