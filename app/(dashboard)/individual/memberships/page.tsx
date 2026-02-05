import Image from 'next/image';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import MembershipModel from '@/server/db/models/membership.model';
import PlanModel from '@/server/db/models/plan.model';
import CorporateStaffModel from '@/server/db/models/staff.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import { redirect } from 'next/navigation';

export default async function MembershipsPage() {
  const session = await getServerAuthSession();

  if (!session || !['INDIVIDUAL', 'STAFF'].includes(session.user?.role || '')) {
    redirect('/auth/signin');
  }

  await connectToDatabase();

  const isStaff = session.user?.role === 'STAFF';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let staffInfo: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let corporateInfo: any = null;

  if (isStaff) {
    // Fetch staff record to get corporate ID
    staffInfo = await CorporateStaffModel.findOne({ userId: session.user.id }).lean();

    if (staffInfo && staffInfo.corporateId) {
      // Fetch corporate information
      corporateInfo = await CorporateProfileModel.findById(staffInfo.corporateId).lean();
    }
  }

  const memberships = !isStaff ? await MembershipModel.find({ subjectId: session.user.id, subjectType: 'USER' }).lean() : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-gray-900 mb-2">
          {isStaff ? 'My Company' : 'My Memberships'}
        </h1>
        <p className="text-gray-600">
          {isStaff ? 'View your company information and details' : 'View your current membership status and upgrade to premium'}
        </p>
      </div>

      {/* STAFF: Company Information Section */}
      {isStaff ? (
        <>
          {corporateInfo ? (
            <div className="space-y-8">
              {/* Company Status Card */}
              <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
                <h2 className="text-3xl font-black mb-2">Company Information</h2>
                <p className="text-blue-100 text-lg">
                  {corporateInfo.companyName}
                </p>
              </div>

              {/* Company Details */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Company Name</label>
                    <p className="text-lg font-bold text-gray-900">{corporateInfo.companyName}</p>
                  </div>

                  {/* Industry */}
                  {corporateInfo.industry && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Industry</label>
                      <p className="text-lg font-bold text-gray-900">{corporateInfo.industry}</p>
                    </div>
                  )}

                  {/* Website */}
                  {corporateInfo.website && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Website</label>
                      <a href={corporateInfo.website} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-blue-600 hover:text-blue-700">
                        {corporateInfo.website}
                      </a>
                    </div>
                  )}

                  {/* Address */}
                  {corporateInfo.address && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Address</label>
                      <p className="text-lg font-bold text-gray-900">{corporateInfo.address}</p>
                    </div>
                  )}

                  {/* Employee Count */}
                  {corporateInfo.employeeCount && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Employee Count</label>
                      <p className="text-lg font-bold text-gray-900">{corporateInfo.employeeCount}</p>
                    </div>
                  )}

                  {/* Registration Number */}
                  {corporateInfo.registrationNumber && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Registration Number</label>
                      <p className="text-lg font-bold text-gray-900">{corporateInfo.registrationNumber}</p>
                    </div>
                  )}

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Status</label>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${corporateInfo.status === 'active' ? 'bg-green-500' : corporateInfo.status === 'verified' ? 'bg-blue-500' : 'bg-yellow-500'}`}></span>
                      <span className="text-lg font-bold text-gray-900 capitalize">{corporateInfo.status}</span>
                    </div>
                  </div>
                </div>

                {/* Company Logo */}
                {corporateInfo.logo && (
                  <div className="pt-8 border-t border-gray-200">
                    <label className="block text-sm font-semibold text-gray-600 mb-4">Company Logo</label>
                    <Image src={corporateInfo.logo} alt="Company Logo" width={128} height={128} className="rounded-lg object-contain border border-gray-200 p-2" />
                  </div>
                )}
              </div>

              {/* Staff Role Information */}
              {staffInfo && (
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Role</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Position</label>
                      <p className="text-lg font-bold text-gray-900 capitalize">{staffInfo.role}</p>
                    </div>

                    {staffInfo.department && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Department</label>
                        <p className="text-lg font-bold text-gray-900">{staffInfo.department}</p>
                      </div>
                    )}

                    {staffInfo.joinDate && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Join Date</label>
                        <p className="text-lg font-bold text-gray-900">{new Date(staffInfo.joinDate).toLocaleDateString()}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Status</label>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${staffInfo.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                        <span className="text-lg font-bold text-gray-900 capitalize">{staffInfo.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Company Information</h3>
              <p className="text-gray-600">Your company information is not available yet. Please contact your corporate administrator.</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* INDIVIDUAL: Current Status Card */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
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
              {(await PlanModel.find({ type: 'individual', active: true }).lean()).map((plan: any) => (
                <div key={plan._id} className={`rounded-2xl shadow-md border-2 p-8 relative ${plan.name.toLowerCase().includes('premium') ? 'bg-linear-to-br from-[#008200] to-[#00B300] border-[#008200] text-white transform scale-105' : 'bg-white border-gray-200'}`}>
                  {plan.name.toLowerCase().includes('premium') && (
                    <div className="absolute -top-4 -right-4 bg-[#00B300] text-white px-4 py-1 rounded-full font-bold text-sm">
                      POPULAR
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className={`text-2xl font-bold mb-2 ${plan.name.toLowerCase().includes('premium') ? '' : 'text-gray-900'}`}>{plan.name}</h4>
                    <p className={plan.name.toLowerCase().includes('premium') ? 'text-green-100' : 'text-gray-600'}>{plan.description}</p>
                  </div>

                  <div className="mb-8">
                    <p className={`text-4xl font-black ${plan.name.toLowerCase().includes('premium') ? '' : 'text-gray-900'}`}>
                      ${plan.price}
                      <span className={`text-lg ${plan.name.toLowerCase().includes('premium') ? 'text-green-100' : 'text-gray-600'}`}>/{plan.billingInterval === 'month' ? 'month' : plan.billingInterval === 'year' ? 'year' : 'lifetime'}</span>
                    </p>
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-xl">✓</span>
                        <span className={plan.name.toLowerCase().includes('premium') ? '' : 'text-gray-700'}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button className={`w-full px-4 py-3 font-bold rounded-lg transition-colors ${plan.name.toLowerCase().includes('premium')
                      ? 'bg-white text-[#008200] hover:bg-gray-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}>
                    {memberships.find(m => m.planId === plan._id.toString()) ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              ))}
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
        </>
      )}
    </div>
  );
}
