import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import MembershipModel from '@/server/db/models/membership.model';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function MembershipsPage() {
  const session = await getServerAuthSession();

  if (!session || session.user?.role !== 'INDIVIDUAL') {
    redirect('/auth/signin');
  }

  await connectToDatabase();
  const memberships = await MembershipModel.find({ subjectId: session.user.id, subjectType: 'USER' }).lean();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-gray-900 mb-2">My Memberships</h1>
        <p className="text-gray-600">View your current membership status and upgrade to premium</p>
      </div>

      {/* Current Status Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-black mb-2">Current Membership Status</h2>
        <p className="text-blue-100 text-lg">
          {memberships.length === 0 ? 'You are not currently a paid member' : 'You have an active membership'}
        </p>
      </div>

      {/* Active Memberships */}
      {memberships.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Active & Pending Memberships</h3>
          {memberships.map((membership, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Plan</p>
                  <p className="text-lg font-bold text-gray-900">{membership.planId || 'Premium Plan'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="font-bold text-gray-900 capitalize">{membership.status || 'Active'}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Start Date</p>
                  <p className="font-bold text-gray-900">
                    {membership.startDate ? new Date(membership.startDate).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">End Date</p>
                  <p className="font-bold text-gray-900">
                    {membership.endDate ? new Date(membership.endDate).toLocaleDateString() : 'Lifetime'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Membership</h3>
          <p className="text-gray-600 mb-6">Upgrade to premium to unlock exclusive features and content</p>
        </div>
      )}

      {/* Membership Plans */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Available Membership Plans</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-8 relative">
            <div className="mb-6">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Free</h4>
              <p className="text-gray-600">Get started with basics</p>
            </div>

            <div className="mb-8">
              <p className="text-4xl font-black text-gray-900">$0<span className="text-lg text-gray-600">/month</span></p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span className="text-gray-700">Browse all courses</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span className="text-gray-700">Limited course access</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">✗</span>
                <span className="text-gray-500">Certificates</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">✗</span>
                <span className="text-gray-500">Priority support</span>
              </div>
            </div>

            <button disabled className="w-full px-4 py-3 bg-gray-200 text-gray-600 font-bold rounded-lg cursor-not-allowed">
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-[#008200] to-[#00B300] rounded-2xl shadow-xl border-2 border-[#008200] p-8 relative text-white transform scale-105">
            <div className="absolute -top-4 -right-4 bg-[#00B300] text-white px-4 py-1 rounded-full font-bold text-sm">
              POPULAR
            </div>

            <div className="mb-6">
              <h4 className="text-2xl font-bold mb-2">Premium</h4>
              <p className="text-green-100">Full access to all content</p>
            </div>

            <div className="mb-8">
              <p className="text-4xl font-black">$9.99<span className="text-lg text-green-100">/month</span></p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span>All courses & materials</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span>Offline access</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span>Certificates</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span>Priority support</span>
              </div>
            </div>

            <button className="w-full px-4 py-3 bg-white text-[#008200] font-bold rounded-lg hover:bg-gray-100 transition-colors">
              Upgrade Now
            </button>
          </div>

          {/* Corporate Plan */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-8">
            <div className="mb-6">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Corporate</h4>
              <p className="text-gray-600">For teams & organizations</p>
            </div>

            <div className="mb-8">
              <p className="text-4xl font-black text-gray-900">Custom<span className="text-lg text-gray-600">/month</span></p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span className="text-gray-700">Team management</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span className="text-gray-700">Analytics & reports</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span className="text-gray-700">Dedicated support</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span className="text-gray-700">Custom content</span>
              </div>
            </div>

            <button className="w-full px-4 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* Renewal History */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Membership History</h3>
        {memberships.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No membership history yet</p>
        ) : (
          <div className="space-y-4">
            {memberships.map((membership, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-bold text-gray-900">{membership.planId || 'Premium Plan'}</p>
                  <p className="text-sm text-gray-600">
                    {membership.startDate && new Date(membership.startDate).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
                  {membership.status || 'Active'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
