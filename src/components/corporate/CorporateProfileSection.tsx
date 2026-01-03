'use client';

import { Building2, Phone, Mail, Globe } from 'lucide-react';
import Link from 'next/link';

export function CorporateProfileSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Profile Card */}
      <Link
        href="/corporate/profile"
        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Company Profile</p>
            <h3 className="text-lg font-bold text-gray-900 mt-2">Tech Solutions Ltd</h3>
          </div>
          <Building2 className="w-10 h-10 text-blue-600" />
        </div>
        <p className="text-gray-600 text-sm mt-4">Manage company information and details</p>
      </Link>

      {/* Contact Card */}
      <Link
        href="/corporate/profile"
        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Contact Information</p>
            <h3 className="text-lg font-bold text-gray-900 mt-2">contact@techsolutions.com</h3>
          </div>
          <Mail className="w-10 h-10 text-green-600" />
        </div>
        <p className="text-gray-600 text-sm mt-4">Update contact details and website</p>
      </Link>

      {/* Settings Card */}
      <Link
        href="/corporate/profile?section=security"
        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Security & Logo</p>
            <h3 className="text-lg font-bold text-gray-900 mt-2">Update Logo</h3>
          </div>
          <Globe className="w-10 h-10 text-orange-600" />
        </div>
        <p className="text-gray-600 text-sm mt-4">Upload company logo and manage security</p>
      </Link>
    </div>
  );
}
