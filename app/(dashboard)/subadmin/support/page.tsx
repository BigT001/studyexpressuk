'use client'

import { useState } from 'react'
import { MessageSquare, Flag, ArrowRight, AlertTriangle } from 'lucide-react'


export default function SupportPage() {
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null)
  const [escalationForm, setEscalationForm] = useState({ title: '', description: '', priority: 'Medium', category: 'Technical' })

  const issues = [
    {
      id: 1,
      title: 'Portal login issues for corporate staff',
      category: 'Technical',
      priority: 'High',
      reporter: 'Tech Industries Ltd (HR Manager)',
      date: '2024-12-28',
      status: 'Escalated',
      description: 'Multiple staff members from Tech Industries unable to log in. Getting "Invalid credentials" error despite correct passwords.',
      steps: [
        'Check user database for account lockout status',
        'Verify email confirmation status',
        'Review recent system changes'
      ]
    },
    {
      id: 2,
      title: 'Certificate download not working',
      category: 'Feature',
      priority: 'Medium',
      reporter: 'Sarah Johnson (Member)',
      date: '2024-12-27',
      status: 'Pending',
      description: 'User completed a course but cannot download the certificate. The download button appears but returns a 404 error.',
      steps: [
        'Verify certificate generation process',
        'Check file storage permissions',
        'Test with different browsers'
      ]
    },
    {
      id: 3,
      title: 'Course progress not updating',
      category: 'Technical',
      priority: 'High',
      reporter: 'James Wilson (Member)',
      date: '2024-12-26',
      status: 'Pending',
      description: 'User completed lessons but progress bar still shows 0%. Completion marks are not being recorded.',
      steps: [
        'Check lesson completion tracking',
        'Verify database updates',
        'Review API logs'
      ]
    },
    {
      id: 4,
      title: 'Event registration confirmation email not sent',
      category: 'Email',
      priority: 'Medium',
      reporter: 'Emma Davis (Member)',
      date: '2024-12-25',
      status: 'Resolved',
      description: 'Registered for event but did not receive confirmation email.',
      steps: [
        'Check email service logs',
        'Verify email template',
        'Test email sending'
      ]
    },
  ]

  const selected = selectedIssue ? issues.find(i => i.id === selectedIssue) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Support & Escalation</h1>
          <p className="text-slate-600 mt-1">Manage member issues and escalate to admin when needed</p>
        </div>
      </div>

      {/* Issues Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Total Issues</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{issues.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Pending</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{issues.filter(i => i.status === 'Pending').length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Escalated</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{issues.filter(i => i.status === 'Escalated').length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Resolved</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{issues.filter(i => i.status === 'Resolved').length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issues List */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Support Tickets</h3>
          </div>

          <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
            {issues.map((issue) => (
              <button
                key={issue.id}
                onClick={() => setSelectedIssue(issue.id)}
                className={`w-full p-4 text-left hover:bg-slate-50 transition-colors border-l-2 ${
                  selectedIssue === issue.id ? 'bg-blue-50 border-l-blue-600' : 'border-l-transparent'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <p className="font-medium text-slate-900 line-clamp-2">{issue.title}</p>
                    <span className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 ${
                      issue.priority === 'High' ? 'bg-red-600' :
                      issue.priority === 'Medium' ? 'bg-amber-600' :
                      'bg-blue-600'
                    }`} />
                  </div>
                  <p className="text-xs text-slate-600">{issue.category}</p>
                  <p className="text-xs text-slate-500">{issue.date}</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    issue.status === 'Escalated' ? 'bg-red-100 text-red-700' :
                    issue.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {issue.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Issue Details */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selected.title}</h2>
                    <p className="text-sm text-slate-600 mt-1">{selected.reporter}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selected.status === 'Escalated' ? 'bg-red-100 text-red-700' :
                    selected.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {selected.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>{selected.category}</span>
                  <span>•</span>
                  <span className={`font-medium ${
                    selected.priority === 'High' ? 'text-red-600' :
                    selected.priority === 'Medium' ? 'text-amber-600' :
                    'text-blue-600'
                  }`}>
                    {selected.priority} Priority
                  </span>
                  <span>•</span>
                  <span>{selected.date}</span>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-slate-900 mb-2">Issue Description</h3>
                <p className="text-slate-700">{selected.description}</p>
              </div>

              {/* Troubleshooting Steps */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-slate-900 mb-3">Recommended Steps</h3>
                <ol className="space-y-2">
                  {selected.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-slate-700">
                      <span className="font-medium text-blue-600 flex-shrink-0">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-200 pt-6 flex gap-3">
                <button className="flex-1 px-4 py-2 border border-slate-200 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Add Comment
                </button>
                {selected.status !== 'Escalated' && selected.status !== 'Resolved' && (
                  <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <Flag className="w-4 h-4 inline mr-2" />
                    Escalate to Admin
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 h-96 flex items-center justify-center">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Select an issue to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Escalation Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ArrowRight className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">Need to Report a New Issue?</h3>
            <p className="text-sm text-blue-800 mb-4">Escalate a member issue directly to the admin team for faster resolution</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Create New Escalation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
