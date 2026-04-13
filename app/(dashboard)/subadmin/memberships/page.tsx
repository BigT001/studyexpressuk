import { connectToDatabase } from '@/server/db/mongoose';
import MembershipModel from '@/server/db/models/membership.model';
import PlanModel from '@/server/db/models/plan.model';
import UserModel from '@/server/db/models/user.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import { Card } from '@/components/ui';

export const dynamic = 'force-dynamic';

export default async function SubAdminMembershipsPage() {
    try {
        await connectToDatabase();

        // Fetch memberships
        const memberships = await MembershipModel.find()
            .sort({ createdAt: -1 })
            .lean()
            .limit(100);

        // Fetch plans to map names
        const plans = await PlanModel.find().lean();
        const planMap = plans.reduce((acc: any, plan: any) => {
            acc[plan._id.toString()] = plan.name;
            return acc;
        }, {});

        // Enhance memberships with user/corporate info and plan name
        const enhancedMemberships = await Promise.all(
            memberships.map(async (m: any) => {
                let name = 'Unknown';
                let email = '-';

                if (m.subjectType === 'USER') {
                    const user = await UserModel.findById(m.subjectId).select('firstName lastName email').lean();
                    if (user) {
                        name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
                        email = user.email;
                    }
                } else if (m.subjectType === 'CORPORATE') {
                    const corp = await CorporateProfileModel.findOne({ ownerId: m.subjectId }).select('companyName').lean();
                    if (corp) {
                        name = corp.companyName;
                    } else {
                        // Fallback to user if profile not found
                        const user = await UserModel.findById(m.subjectId).select('email').lean();
                        email = user?.email || '-';
                    }
                }

                return {
                    ...m,
                    subjectName: name,
                    subjectEmail: email,
                    planName: planMap[m.planId] || m.planId,
                };
            })
        );

        const stats = {
            active: memberships.filter((m: any) => m.status === 'active').length,
            pending: memberships.filter((m: any) => m.status === 'pending').length,
            expired: memberships.filter((m: any) => m.status === 'expired').length,
            total: memberships.length,
        };

        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Membership Management</h1>
                        <p className="text-gray-600 mt-2">View and manage all active, pending, and expired subscriptions.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="border-l-4 border-green-500">
                            <div className="p-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active</p>
                                <p className="text-2xl font-black text-gray-900">{stats.active}</p>
                            </div>
                        </Card>
                        <Card className="border-l-4 border-yellow-500">
                            <div className="p-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending</p>
                                <p className="text-2xl font-black text-gray-900">{stats.pending}</p>
                            </div>
                        </Card>
                        <Card className="border-l-4 border-red-500">
                            <div className="p-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Expired</p>
                                <p className="text-2xl font-black text-gray-900">{stats.expired}</p>
                            </div>
                        </Card>
                        <Card className="border-l-4 border-blue-500">
                            <div className="p-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total</p>
                                <p className="text-2xl font-black text-gray-900">{stats.total}</p>
                            </div>
                        </Card>
                    </div>

                    {/* Memberships Table */}
                    <Card>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-gray-700">Subscriber</th>
                                        <th className="px-6 py-4 font-bold text-gray-700">Type</th>
                                        <th className="px-6 py-4 font-bold text-gray-700">Plan</th>
                                        <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                                        <th className="px-6 py-4 font-bold text-gray-700">Period</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {enhancedMemberships.length > 0 ? (
                                        enhancedMemberships.map((m: any) => (
                                            <tr key={m._id.toString()} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">{m.subjectName}</div>
                                                    <div className="text-xs text-gray-500">{m.subjectEmail}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                                                        m.subjectType === 'CORPORATE' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {m.subjectType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-700">
                                                    {m.planName}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                        m.status === 'active' ? 'bg-green-100 text-green-700' :
                                                        m.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                        {m.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-gray-500">
                                                    {m.startDate ? new Date(m.startDate).toLocaleDateString() : 'N/A'} - {m.endDate ? new Date(m.endDate).toLocaleDateString() : 'Forever'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">
                                                No memberships found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error loading memberships:', error);
        return <div className="p-8 text-red-600 font-bold">Failed to load membership data.</div>;
    }
}
