'use client';

import { useState } from 'react';

export default function CorporateMembershipsPage() {
  const [memberships] = useState([
    {
      id: 1,
      plan: 'Professional',
      status: 'Active',
      members: 25,
      startDate: 'Jan 1, 2024',
      endDate: 'Dec 31, 2024',
      price: '$5,000',
      color: 'blue',
    },
    {
      id: 2,
      plan: 'Enterprise',
      status: 'Active',
      members: 100,
      startDate: 'Feb 15, 2024',
      endDate: 'Feb 14, 2025',
      price: '$15,000',
      color: 'purple',
    },
  ]);

  const [plans] = useState([
    {
      name: 'Professional',
      price: '$5,000',
      period: 'per year',
      members: 'Up to 50',
      features: [
        'Staff enrollment in courses',
        'Progress tracking',
        'Basic reporting',
        'Email support',
      ],
      recommended: false,
    },
    {
      name: 'Enterprise',
      price: '$15,000',
      period: 'per year',
      members: 'Unlimited',
      features: [
        'Unlimited staff enrollment',
        'Advanced analytics',
        'Custom reporting',
        'Priority support',
        'API access',
        'Dedicated account manager',
      ],
      recommended: true,
    },
    {
      name: 'Custom',
      price: 'Contact us',
      period: 'custom pricing',
      members: 'Tailored',
      features: [
        'All Enterprise features',
        'Custom integrations',
        'White-label options',
        'SLA guarantees',
      ],
      recommended: false,
    },
  ]);

  const renewalHistory = [
    {
      id: 1,
      plan: 'Professional',
      date: 'Jan 1, 2024',
      amount: '$5,000',
      status: 'Completed',
    },
    {
      id: 2,
      plan: 'Professional',
      date: 'Jan 1, 2023',
      amount: '$4,500',
      status: 'Completed',
    },
    {
      id: 3,
      plan: 'Professional',
      date: 'Jan 1, 2022',
      amount: '$4,500',
      status: 'Completed',
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Current Membership Status */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Membership Status</h1>
          <p className="text-gray-600 mt-1">View and manage your corporate memberships</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {memberships.map(membership => (
            <div key={membership.id} className={`border-l-4 border-${membership.color}-500 bg-${membership.color}-50 rounded-lg p-6`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{membership.plan}</h3>
                  <span className={`inline-block mt-2 px-3 py-1 bg-${membership.color}-200 text-${membership.color}-900 rounded-full text-sm font-medium`}>
                    {membership.status}
                  </span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{membership.price}</span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">👥</span>
                  <div>
                    <p className="text-xs text-gray-600">Members</p>
                    <p className="font-bold text-gray-900">{membership.members}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl">📅</span>
                  <div>
                    <p className="text-xs text-gray-600">Expires</p>
                    <p className="font-bold text-gray-900">{membership.endDate}</p>
                  </div>
                </div>
              </div>

              <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Manage Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Plan</h2>
          <p className="text-gray-600 mt-1">Choose the plan that best fits your organization</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-lg border-2 p-6 transition-all ${
                plan.recommended
                  ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.recommended && (
                <div className="mb-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Recommended
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600 ml-2">{plan.period}</span>
              </div>
              <p className="text-gray-600 mt-2">{plan.members}</p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, fdx) => (
                  <li key={fdx} className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                      ✓
                    </span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`mt-6 w-full py-3 rounded-lg font-medium transition-colors ${
                plan.recommended
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'border border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}>
                {plan.name === 'Custom' ? 'Contact Sales' : 'Upgrade Now'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Renewal History */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Renewal History</h2>
          <p className="text-gray-600 mt-1">Track all your past membership renewals</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Plan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {renewalHistory.map((renewal, idx) => (
                <tr key={renewal.id} className={`border-b border-gray-100 ${idx % 2 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{renewal.plan}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{renewal.date}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{renewal.amount}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-900 rounded-full text-sm font-medium">
                      {renewal.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
