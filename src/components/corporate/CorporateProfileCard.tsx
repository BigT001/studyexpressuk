'use client';

import Image from 'next/image';
import { Building2, Users, Mail, Globe } from 'lucide-react';

interface CorporateProfileCardProps {
  companyName?: string;
  contactPerson?: string;
  email?: string;
  staffCount?: number;
  logo?: string;
}

export function CorporateProfileCard({
  companyName = 'Company Name',
  contactPerson = 'Contact Person',
  email = 'contact@company.com',
  staffCount = 0,
  logo,
}: CorporateProfileCardProps) {
  return (
    <div className="flex items-center gap-6 mb-6">
      {/* Company Logo/Icon */}
      <div className="flex-shrink-0 flex items-center justify-center w-44 h-44 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 border-4 border-blue-200 shadow-lg overflow-hidden">
        {logo ? (
          <Image
            src={logo}
            alt="Company Logo"
            width={176}
            height={176}
            className="w-full h-full object-cover"
            unoptimized
          />
        ) : (
          <Building2 className="w-20 h-20 text-blue-600" />
        )}
      </div>
      
      {/* Company Info */}
      <div className="flex-1">
        <h1 className="font-bold text-2xl text-gray-900 mb-3">{companyName}</h1>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 text-sm">
              <span className="font-semibold text-gray-900">{staffCount}</span> staff members
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 text-sm">{email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 text-sm">{contactPerson}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
