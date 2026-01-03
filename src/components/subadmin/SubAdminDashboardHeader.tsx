'use client'

export function SubAdminDashboardHeader({ name, role }: { name: string; role: string }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
      <h1 className="text-3xl font-bold mb-2">Welcome, {name}!</h1>
      <p className="text-blue-100">
        Manage member accounts, approve staff registrations, and monitor platform activity
      </p>
      <div className="flex items-center gap-2 mt-4">
        <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
          {role}
        </span>
      </div>
    </div>
  )
}
