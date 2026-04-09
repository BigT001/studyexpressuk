import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import PlanModel from '@/server/db/models/plan.model';
import MembershipModel from '@/server/db/models/membership.model';
import PaymentModel from '@/server/db/models/payment.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import { redirect } from 'next/navigation';

export default async function CorporateMembershipsPage() {
  const session = await getServerAuthSession();

  if (!session || !['CORPORATE', 'STAFF'].includes(session.user?.role || '')) {
    redirect('/auth/signin');
  }

  await connectToDatabase();
  const plans = await PlanModel.find({ type: 'corporate', active: true }).lean() as any[];

  let memberships: any[] = [];
  let renewalHistory: any[] = [];
  let totalMembers = 0;

  const corporate = await CorporateProfileModel.findOne({ ownerId: session.user.id }).lean();

  if (corporate) {
    totalMembers = corporate.employeeCount || 0;

    const dbMemberships = await MembershipModel.find({ 
      subjectType: 'CORPORATE', 
      subjectId: corporate._id 
    }).lean() as any[];

    memberships = dbMemberships.map(m => {
      const plan = plans.find(p => p._id.toString() === m.planId.toString());
      return {
        id: m._id.toString(),
        plan: plan ? plan.name : 'Unknown Plan',
        status: m.status,
        members: totalMembers,
        startDate: m.startDate ? new Date(m.startDate).toLocaleDateString() : 'N/A',
        endDate: m.endDate ? new Date(m.endDate).toLocaleDateString() : 'N/A',
        price: plan ? `$${plan.price}` : 'N/A',
        color: m.status === 'active' ? 'green' : 'gray'
      };
    });

    const dbPayments = await PaymentModel.find({
      subjectType: 'CORPORATE',
      subjectId: corporate._id
    }).sort({ createdAt: -1 }).lean() as any[];

    renewalHistory = dbPayments.map(p => ({
      id: p._id.toString(),
      plan: p.metadata?.planName || 'Corporate Plan',
      date: new Date(p.createdAt).toLocaleDateString(),
      amount: `$${(p.amount / 100).toFixed(2)}`,
      status: p.status === 'succeeded' ? 'Completed' : (p.status === 'failed' ? 'Failed' : 'Pending')
    }));
  }

  return (
    <div className="space-y-8 p-6">
      {/* Current Membership Status */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Membership Status</h1>
          <p className="text-gray-600 mt-1">View and manage your corporate memberships</p>
        </div>

        <div className="p-6">
          {memberships.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              You do not have any active memberships yet. Please upgrade a plan below.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {memberships.map(membership => (
                <div key={membership.id} className={`border-l-4 border-${membership.color}-500 bg-${membership.color}-50 rounded-lg p-6`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{membership.plan}</h3>
                      <span className={`inline-block mt-2 px-3 py-1 bg-${membership.color}-200 text-${membership.color}-900 rounded-full text-sm font-medium capitalize`}>
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
          )}
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Plan</h2>
          <p className="text-gray-600 mt-1">Choose the plan that best fits your organization</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No corporate plans available at the moment.
            </div>
          ) : (
            plans.map((plan: any, idx) => (
              <div
                key={plan._id || idx}
                className={`rounded-lg border-2 p-6 transition-all border-gray-200 hover:border-gray-300 flex flex-col`}
              >
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-2 text-gray-600">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="ml-1">/{plan.billingInterval}</span>
                </div>
                <p className="text-sm text-gray-600 mt-3 flex-grow">{plan.description}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature: string, fdx: number) => (
                    <li key={fdx} className="flex items-start gap-3">
                      <span className="w-5 h-5 mt-0.5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                        ✓
                      </span>
                      <span className="text-gray-700 text-sm leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`mt-8 w-full py-3 rounded-lg font-medium transition-colors border border-gray-300 text-gray-900 hover:bg-gray-50`}>
                  Select Plan
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Renewal History */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Renewal History</h2>
          <p className="text-gray-600 mt-1">Track all your past membership renewals</p>
        </div>

        <div className="overflow-x-auto">
          {renewalHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50">
              No previous renewals found.
            </div>
          ) : (
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
                {renewalHistory.map((renewal: any, idx: number) => (
                  <tr key={renewal.id} className={`border-b border-gray-100 ${idx % 2 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{renewal.plan}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{renewal.date}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{renewal.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        renewal.status === 'Completed' ? 'bg-green-100 text-green-900' :
                        renewal.status === 'Failed' ? 'bg-red-100 text-red-900' :
                        'bg-yellow-100 text-yellow-900'
                      }`}>
                        {renewal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
