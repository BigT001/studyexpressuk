import { 
  CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, 
  RefreshCcw, Activity, Search, Download, 
  MoreHorizontal, Wallet, TrendingUp,
  CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import { getServerAuthSession } from '@/server/auth/session';
import { redirect } from 'next/navigation';
import { connectToDatabase } from '@/server/db/mongoose';
import PaymentModel from '@/server/db/models/payment.model';
import UserModel from '@/server/db/models/user.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';

export default async function PaymentsPage() {
  const session = await getServerAuthSession();
  if (!session || !['ADMIN', 'SUB_ADMIN'].includes(session.user?.role || '')) {
    redirect('/auth/signin');
  }

  await connectToDatabase();

  // Fetch Payment Data
  const payments = await PaymentModel.find().lean();
  
  const totalTxns = payments.length;
  // Succeeded revenue in exact dollars (assuming amount is cents)
  const totalRevenue = payments
    .filter(p => p.status === 'succeeded')
    .reduce((acc, p) => acc + (p.amount / 100), 0);
    
  const refundedCount = payments.filter(p => p.status === 'refunded').length;
  const refundRate = totalTxns > 0 ? ((refundedCount / totalTxns) * 100).toFixed(1) : '0.0';
  const refundRateNum = parseFloat(refundRate);

  // Recent Transactions (top 15)
  const recentTxnsRaw = await PaymentModel.find().sort({ createdAt: -1 }).limit(15).lean();
  
  // Attach user/corporate info
  const recentTxns = await Promise.all(
    recentTxnsRaw.map(async (txn: any) => {
      let subjectName = 'Unknown User';
      let subjectEmail = '';
      
      if (txn.subjectType === 'USER') {
        const user = await UserModel.findById(txn.subjectId).select('name email').lean();
        if (user) {
          subjectName = (user as any).name || (user as any).firstName ? `${(user as any).firstName} ${(user as any).lastName || ''}`.trim() : 'User';
          subjectEmail = (user as any).email || '';
        }
      } else if (txn.subjectType === 'CORPORATE') {
        const corp = await CorporateProfileModel.findById(txn.subjectId).select('companyName contactEmail').lean();
        if (corp) {
          subjectName = corp.companyName || 'Corporate';
          subjectEmail = (corp as any).contactEmail || '';
        }
      }

      return {
        ...txn,
        subjectName,
        subjectEmail
      };
    })
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3 flex items-center gap-3">
            Payments & FinOps <Wallet className="text-emerald-500" size={36} />
          </h1>
          <p className="text-lg text-gray-500 font-medium tracking-wide">
            Manage global financial transactions, revenue streams, and processing APIs.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold rounded-xl flex items-center gap-2 transition-colors">
            <Download size={18} /> Export CSV
          </button>
          <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95">
            <CreditCard size={18} /> Payouts
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <DollarSign size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-teal-100 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                <TrendingUp size={16} /> Total Revenue (YTD)
              </h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter">
                ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-emerald-200 font-semibold uppercase">USD</span>
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              <Activity size={16} /> Processed Vol
            </h3>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-black text-gray-900">{totalTxns.toLocaleString()}</span>
            <span className="text-gray-500 font-semibold">txns</span>
          </div>
          <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
            <ArrowUpRight size={16} /> Historic sum
          </p>
        </div>

        {/* Refund Rate */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              <RefreshCcw size={16} /> Refund Rate
            </h3>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-black text-gray-900">{refundRate}%</span>
            <span className="text-gray-500 font-semibold text-sm">({refundedCount} refunds)</span>
          </div>
          <p className={`text-sm font-semibold flex items-center gap-1 ${refundRateNum > 3 ? 'text-red-500' : 'text-emerald-600'}`}>
            {refundRateNum > 3 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />} 
            {refundRateNum > 3 ? 'Elevated threshold' : 'Healthy threshold'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Transactions Log */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="text-blue-600" size={24} />
              Recent Transactions
            </h3>
          </div>
          
          {recentTxns.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-16 text-center bg-gray-50/50">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Search className="text-gray-400" size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">No ledgers found</h4>
              <p className="text-gray-500 max-w-sm mb-6">No financial transactions recorded in the database yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {recentTxns.map((txn, idx) => (
                    <tr key={txn._id?.toString() || idx} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{txn.subjectName}</p>
                        <p className="text-gray-500 text-xs">{txn.subjectEmail || 'No email'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">${(txn.amount / 100).toFixed(2)} <span className="text-xs text-gray-400 uppercase">{txn.currency}</span></p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider
                          ${txn.status === 'succeeded' ? 'bg-emerald-100 text-emerald-700' : 
                            txn.status === 'refunded' ? 'bg-orange-100 text-orange-700' :
                            txn.status === 'failed' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                          {txn.status === 'succeeded' && <CheckCircle2 size={12} />}
                          {txn.status === 'pending' && <Clock size={12} />}
                          {txn.status === 'failed' && <AlertCircle size={12} />}
                          {txn.status === 'refunded' && <RefreshCcw size={12} />}
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Refund Manager */}
          <div className="bg-gradient-to-b from-orange-50 to-white rounded-3xl border border-orange-100 shadow-lg p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <RefreshCcw size={100} className="text-orange-900" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10 flex items-center gap-2">
              <RefreshCcw className="text-orange-500" size={24} /> Refunds
            </h3>
            <p className="text-gray-600 text-sm mb-8 relative z-10 font-medium">
              Review and immediately process student refunds, dispute handling, and automated chargebacks.
            </p>
            
            <button className="w-full relative z-10 bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold text-sm tracking-wide uppercase transition-all shadow-lg shadow-orange-600/30 active:scale-95 flex justify-center items-center gap-2">
               Manage Requests <span className="bg-orange-800 text-orange-100 text-xs px-2 py-0.5 rounded-full ml-1">{refundedCount}</span>
            </button>
          </div>

          {/* Quick Actions List */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
            <h3 className="text-lg font-bold border-b border-gray-100 pb-4 mb-4 text-gray-900">
              Gateway Actions
            </h3>
            <ul className="space-y-2">
              <li>
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 text-left font-bold text-gray-700 transition border border-transparent hover:border-gray-200 group">
                  <span className="flex items-center gap-3">
                    <span className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                      <CreditCard size={18} />
                    </span>
                    Stripe Dashboard
                  </span>
                  <ArrowUpRight size={18} className="text-gray-400 group-hover:text-blue-500" />
                </button>
              </li>
              <li>
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 text-left font-bold text-gray-700 transition border border-transparent hover:border-gray-200 group">
                  <span className="flex items-center gap-3">
                    <span className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition">
                      <Download size={18} />
                    </span>
                    Download Invoices
                  </span>
                  <MoreHorizontal size={18} className="text-gray-400" />
                </button>
              </li>
              <li>
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 text-left font-bold text-gray-700 transition border border-transparent hover:border-gray-200 group">
                  <span className="flex items-center gap-3">
                    <span className="p-2 bg-gray-100 text-gray-600 rounded-lg group-hover:bg-gray-900 group-hover:text-white transition">
                      <Activity size={18} />
                    </span>
                    Audit Logs
                  </span>
                  <MoreHorizontal size={18} className="text-gray-400" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
