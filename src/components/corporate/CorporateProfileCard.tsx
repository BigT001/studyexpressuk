'use client';

import Image from 'next/image';
import { Building2 } from 'lucide-react';

interface CorporateProfileCardProps {
  companyName?: string;
  email?: string;
  bio?: string;
  logo?: string;
}

export function CorporateProfileCard({
  companyName = 'Company Name',
  email = 'contact@company.com',
  bio = 'Welcome to our company dashboard',
  logo,
}: CorporateProfileCardProps) {
  return (
    <div className="flex items-start gap-6 mb-6">
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
      <div className="flex-1 min-w-0">
        <h1 className="font-bold text-3xl text-gray-900 mb-2">{companyName}</h1>
        <p className="text-sm text-gray-600 mb-3">{email}</p>
        
        <p className="text-sm text-gray-700 line-clamp-4 leading-relaxed">{bio}</p>
      </div>
    </div>
  );
}
