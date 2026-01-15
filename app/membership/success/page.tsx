import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function MembershipSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Your membership has been activated. You now have full access to all features and courses.
        </p>

        {/* Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Order Status:</span>
            <span className="font-semibold text-green-600">✓ Confirmed</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Receipt:</span>
            <span className="font-semibold text-gray-900">Email sent to your inbox</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Membership:</span>
            <span className="font-semibold text-blue-600">Active</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/individual"
            className="block w-full bg-[#008200] text-white py-3 rounded-lg font-bold hover:bg-[#006600] transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/courses"
            className="block w-full border-2 border-[#008200] text-[#008200] py-3 rounded-lg font-bold hover:bg-green-50 transition-colors"
          >
            Browse Courses
          </Link>
        </div>

        {/* Support */}
        <p className="text-xs text-gray-500 mt-6">
          Need help? Contact our support team at{' '}
          <a href="mailto:support@studyexpressuk.com" className="text-blue-600 hover:underline">
            support@studyexpressuk.com
          </a>
        </p>
      </div>
    </div>
  );
}
