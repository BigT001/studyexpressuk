export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Payments & Transactions</h2>
        <p className="text-gray-600 mt-2">Manage all financial transactions and payment processing</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">💳 Transaction History</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-semibold">Total Transactions</span>
              <span className="text-2xl font-bold text-blue-600">--</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-semibold">Total Revenue</span>
              <span className="text-2xl font-bold text-green-600">--</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">🔄 Refunds & Reversals</h3>
          <p className="text-gray-600 text-sm mb-4">Process refunds, handle chargebacks, and manage disputes</p>
          <button className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
            Manage Refunds
          </button>
        </div>
      </div>
    </div>
  );
}
