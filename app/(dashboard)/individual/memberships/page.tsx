import Image from 'next/image';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import MembershipModel from '@/server/db/models/membership.model';
import PlanModel from '@/server/db/models/plan.model';
import CorporateStaffModel from '@/server/db/models/staff.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import { redirect } from 'next/navigation';
import { MembershipCard } from '@/components/MembershipCard';
import { 
  Building2, Briefcase, MapPin, Globe, CreditCard, 
  CheckCircle2, AlertCircle, Clock, CalendarDays, Key, Users,
  Zap, Star
} from 'lucide-react';

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
  const activeMemberships = memberships.filter(m => m.status === 'active' || m.status === 'pending');
  const hasActiveMembership = activeMemberships.length > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">
          {isStaff ? 'My Company' : 'My Memberships'}
        </h1>
        <p className="text-lg text-gray-500 font-medium tracking-wide">
          {isStaff ? 'View your corporate relationship and organizational details.' : 'Manage your subscription, view benefits, and upgrade your plan.'}
        </p>
      </div>

      {/* STAFF: Company Information Section */}
      {isStaff ? (
        <>
          {corporateInfo ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Company Status Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-800 text-white p-10 shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Building2 size={240} />
                </div>
                
                <div className="relative z-10 flex items-center gap-6">
                  {corporateInfo.logo ? (
                    <div className="h-24 w-24 rounded-2xl bg-white p-2 shadow-lg">
                      <Image src={corporateInfo.logo} alt="Company Logo" width={96} height={96} className="h-full w-full object-contain" />
                    </div>
                  ) : (
                    <div className="h-24 w-24 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shadow-lg border border-white/20">
                      <Building2 size={40} className="text-white" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-sm font-bold tracking-widest text-blue-300 uppercase mb-2">Corporate Account</h2>
                    <h3 className="text-4xl font-black">{corporateInfo.companyName}</h3>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Company Details */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                  <h3 className="text-xl font-bold border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
                    <Building2 className="text-blue-600" size={24} />
                    Organization Info
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-8">
                    {corporateInfo.industry && (
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                          <Briefcase size={16} /> Industry
                        </label>
                        <p className="text-lg font-bold text-gray-900">{corporateInfo.industry}</p>
                      </div>
                    )}

                    {corporateInfo.website && (
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                          <Globe size={16} /> Website
                        </label>
                        <a href={corporateInfo.website} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-blue-600 hover:text-blue-700 underline decoration-blue-200 underline-offset-4">
                          {corporateInfo.website}
                        </a>
                      </div>
                    )}

                    {corporateInfo.address && (
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                          <MapPin size={16} /> Address
                        </label>
                        <p className="text-lg font-bold text-gray-900 leading-relaxed">{corporateInfo.address}</p>
                      </div>
                    )}

                    {corporateInfo.employeeCount && (
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                          <Users size={16} /> Employees
                        </label>
                        <p className="text-lg font-bold text-gray-900">{corporateInfo.employeeCount}</p>
                      </div>
                    )}

                    {corporateInfo.registrationNumber && (
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                          <Key size={16} /> Registration ID
                        </label>
                        <p className="text-lg font-bold text-gray-900">{corporateInfo.registrationNumber}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Staff Role Information */}
                {staffInfo && (
                  <div className="bg-gradient-to-b from-gray-50 to-white rounded-3xl shadow-lg border border-gray-100 p-8">
                    <h3 className="text-xl font-bold border-b border-gray-200 pb-4 mb-6 flex items-center gap-2">
                      <Briefcase className="text-indigo-600" size={24} />
                      Your Role
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <Briefcase size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-500">Position</p>
                          <p className="text-lg font-bold text-gray-900 capitalize">{staffInfo.role}</p>
                        </div>
                      </div>

                      {staffInfo.department && (
                        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Building2 size={24} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-500">Department</p>
                            <p className="text-lg font-bold text-gray-900">{staffInfo.department}</p>
                          </div>
                        </div>
                      )}

                      {staffInfo.joinDate && (
                        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                          <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <CalendarDays size={24} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-500">Joined</p>
                            <p className="text-lg font-bold text-gray-900">{new Date(staffInfo.joinDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 py-20 text-center animate-in fade-in">
              <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
                <Building2 className="text-gray-400" size={48} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3">No Corporate Info</h3>
              <p className="text-lg text-gray-500 max-w-md">Your corporate connection is currently unavailable. Please reach out to your administrator to link your account.</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* INDIVIDUAL: Current Status Banner */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
            <div className={`relative overflow-hidden rounded-3xl p-10 shadow-2xl transition-all duration-500 ${
              hasActiveMembership 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white' 
                : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white'
            }`}>
              <div className="absolute top-0 right-0 p-12 opacity-10">
                {hasActiveMembership ? <CheckCircle2 size={240} /> : <CreditCard size={240} />}
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-sm font-bold tracking-widest text-white/70 uppercase mb-2">Member Status</h2>
                  <h3 className="text-4xl font-black mb-3">
                    {hasActiveMembership ? 'Active Premium Member' : 'Free Account'}
                  </h3>
                  <p className="text-lg text-white/90 max-w-xl">
                    {hasActiveMembership 
                      ? 'You are currently enjoying all the premium benefits, exclusive courses, and prioritized support on the platform.'
                      : 'You are currently on a free account. Upgrade to a premium membership to unlock our entire catalog of content and exclusive features.'}
                  </p>
                </div>
                
                {!hasActiveMembership && (
                  <a href="#plans" 
                    className="shrink-0 bg-white text-gray-900 hover:bg-gray-100 flex items-center gap-2 px-8 py-4 rounded-xl font-bold shadow-xl transition-transform hover:scale-105 active:scale-95">
                    View Upgrades <Zap className="w-5 h-5 fill-current" />
                  </a>
                )}
              </div>
            </div>

            {/* Active Memberships Detail Cards */}
            {hasActiveMembership && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <Star className="text-amber-400 fill-amber-400" size={28} /> Active Subscription
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeMemberships.map((membership, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:scale-150 duration-700"></div>
                      
                      <div className="relative z-10 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Plan</p>
                            <p className="text-2xl font-black text-gray-900 capitalize">{membership.planId || 'Premium'}</p>
                          </div>
                          <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            {membership.status || 'Active'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Clock size={12}/> Started</p>
                            <p className="font-bold text-gray-900">
                              {membership.startDate ? new Date(membership.startDate).toLocaleDateString() : '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><CalendarDays size={12}/> Renews</p>
                            <p className="font-bold text-gray-900">
                              {membership.endDate ? new Date(membership.endDate).toLocaleDateString() : 'Lifetime'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Membership Plans Section */}
          <div id="plans" className="pt-10 scroll-mt-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h3 className="text-4xl font-black text-gray-900 mb-4">Choose Your Path</h3>
              <p className="text-xl text-gray-500">Simple, transparent pricing to give you the exact educational boost you need.</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 items-stretch">
              {(await PlanModel.find({ type: 'individual', active: true }).lean()).map((plan: any) => {
                const isCurrent = memberships.some(m => m.planId === plan._id.toString() && (m.status === 'active' || m.status === 'pending'));
                return (
                  <MembershipCard 
                    key={plan._id.toString()}
                    planId={plan._id.toString()}
                    planType="individual"
                    planName={plan.name}
                    price={plan.price}
                    features={plan.features || []}
                    billingInterval={plan.billingInterval}
                    isCurrentPlan={isCurrent}
                  />
                );
              })}
            </div>
          </div>

          {/* Renewal History Table */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-10">
            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <Clock className="text-gray-400" size={28} /> Billing History
            </h3>
            
            {memberships.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <AlertCircle className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-lg font-medium text-gray-500">No previous billing history found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="pb-4 font-bold text-gray-500 uppercase tracking-wider text-sm">Plan Details</th>
                      <th className="pb-4 font-bold text-gray-500 uppercase tracking-wider text-sm hidden sm:table-cell">Duration</th>
                      <th className="pb-4 font-bold text-gray-500 uppercase tracking-wider text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {memberships.map((membership, idx) => (
                      <tr key={idx} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-5 pr-4">
                          <p className="font-bold text-gray-900 text-lg capitalize">{membership.planId || 'Premium Plan'}</p>
                          <p className="text-sm text-gray-500 sm:hidden mt-1">
                            {membership.startDate && new Date(membership.startDate).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-5 pr-4 hidden sm:table-cell">
                          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                            <span>{membership.startDate ? new Date(membership.startDate).toLocaleDateString() : '—'}</span>
                            <span className="text-gray-300">→</span>
                            <span>{membership.endDate ? new Date(membership.endDate).toLocaleDateString() : 'Lifetime'}</span>
                          </div>
                        </td>
                        <td className="py-5">
                          <span className={`inline-flex px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider
                            ${membership.status === 'active' || membership.status === 'pending' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-gray-100 text-gray-600'
                            }`}>
                            {membership.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
