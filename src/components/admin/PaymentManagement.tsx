'use client';

interface Transaction {
  id: string;
  memberName: string;
  type: 'upgrade' | 'renewal' | 'refund';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

export function PaymentManagement() {
  const transactions: Transaction[] = [
    {
      id: '1',
      memberName: 'John Doe',
      type: 'upgrade',
      amount: 99.99,
      status: 'completed',
      date: '2025-12-20',
    },
    {
      id: '2',
      memberName: 'Acme Corp',
      type: 'renewal',
      amount: 299.99,
      status: 'completed',
      date: '2025-12-19',
    },
    {
      id: '3',
      memberName: 'Sarah Smith',
      type: 'refund',
      amount: -49.99,
      status: 'completed',
      date: '2025-12-18',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'upgrade':
        return '📈';
      case 'renewal':
        return '🔄';
      case 'refund':
        return '⏮️';
      default:
        return '💳';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-b border-gray-200">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Total Revenue (This Month)</p>
          <p className="text-3xl font-bold text-green-600 mt-2">$12,450</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Pending Transactions</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">5</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Refunds (This Month)</p>
          <p className="text-3xl font-bold text-red-600 mt-2">$500</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Member
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {transaction.memberName}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="flex items-center gap-2">
                    {getTypeIcon(transaction.type)}
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold">
                  <span
                    className={
                      transaction.amount > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors">
                    View
                  </button>
                  {transaction.status === 'completed' &&
                    transaction.type !== 'refund' && (
                      <button className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors">
                        Refund
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
