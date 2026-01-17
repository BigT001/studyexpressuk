'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface CorporateProfileData {
  companyName: string;
  email: string;
  phone: string;
  industry: string;
  employeeCount: string;
  website: string;
  address: string;
  registrationNumber: string;
  taxId: string;
  logo: string;
  bio: string;
}

export default function CorporateProfilePage() {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<CorporateProfileData>({
    companyName: '',
    email: session?.user?.email || '',
    phone: '',
    industry: '',
    employeeCount: '',
    website: '',
    address: '',
    registrationNumber: '',
    taxId: '',
    logo: '',
    bio: '',
  });
  const [originalData, setOriginalData] = useState<CorporateProfileData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/corporates/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const data = await response.json();
        const newProfileData: CorporateProfileData = {
          companyName: data.profile?.companyName || '',
          email: session?.user?.email || '',
          phone: data.profile?.contactPerson || '',
          industry: data.profile?.industry || '',
          employeeCount: data.profile?.employeeCount?.toString() || '',
          website: data.profile?.website || '',
          address: data.profile?.address || '',
          registrationNumber: data.profile?.registrationNumber || '',
          taxId: data.profile?.taxId || '',
          logo: data.profile?.logo || '',
          bio: data.profile?.bio || '',
        };
        
        setProfileData(newProfileData);
        setOriginalData(newProfileData);
        setHasChanges(false);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setSaveError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchProfileData();
    }
  }, [session?.user?.id, session?.user?.email]);

  const handleInputChange = (field: keyof CorporateProfileData, value: string) => {
    const newData = { ...profileData, [field]: value };
    setProfileData(newData);
    setSaveError('');
    setSaveSuccess(false);
    
    // Check if data has actually changed from original
    const hasActualChanges = originalData && JSON.stringify(newData) !== JSON.stringify(originalData);
    setHasChanges(!!hasActualChanges);
  };

  const handleImageUpload = (url: string) => {
    const newData = { ...profileData, logo: url };
    setProfileData(newData);
    setSaveError('');
    setSaveSuccess(false);
    
    // Check if data has actually changed from original
    const hasActualChanges = originalData && JSON.stringify(newData) !== JSON.stringify(originalData);
    setHasChanges(!!hasActualChanges);
  };

  const handleSaveChanges = async () => {
    if (!session?.user?.id) {
      setSaveError('No user session found');
      return;
    }

    try {
      setIsSaving(true);
      setSaveError('');
      setSaveSuccess(false);
      
      const response = await fetch('/api/corporates/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: profileData.companyName,
          industry: profileData.industry,
          employeeCount: profileData.employeeCount ? parseInt(profileData.employeeCount) : undefined,
          website: profileData.website,
          address: profileData.address,
          registrationNumber: profileData.registrationNumber,
          taxId: profileData.taxId,
          logo: profileData.logo,
          contactPerson: profileData.phone,
          bio: profileData.bio,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save profile');
      }

      const result = await response.json();
      
      // Update original data with the saved data to mark as persisted
      setOriginalData(profileData);
      setHasChanges(false);
      setSaveSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#008200] mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const employeeRanges = [
    { value: '1', label: '1-50' },
    { value: '50', label: '51-200' },
    { value: '200', label: '201-500' },
    { value: '500', label: '501-1000' },
    { value: '1000', label: '1000+' },
  ];

  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Retail',
    'Manufacturing',
    'Consulting',
    'Agriculture',
    'Construction',
    'Energy',
    'Transportation',
    'Hospitality',
    'Other',
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-gray-900 mb-2">Company Profile</h1>
        <p className="text-gray-600">Manage your company information and account settings</p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-900">Profile Updated</h3>
            <p className="text-sm text-green-700 mt-1">Your company profile has been saved successfully.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {saveError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-sm text-red-700 mt-1">{saveError}</p>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        {/* Company Logo Upload */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <CloudinaryUpload
            folder="users"
            onUploadSuccess={handleImageUpload}
            currentImage={profileData.logo}
            label="Company Logo"
            width={140}
            height={140}
            buttonText="🏢 Upload Logo"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Company Information Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Company Information</h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
              <input
                type="text"
                value={profileData.companyName}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Company name cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Account email (cannot be changed)</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
              <select
                value={profileData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent transition-all"
              >
                <option value="">Select an industry</option>
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Describe your company, mission, and values..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent transition-all resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">This bio will be displayed on your company dashboard</p>
            </div>
          </div>

          {/* Business Details Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Business Details</h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Employees</label>
              <select
                value={profileData.employeeCount}
                onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent transition-all"
              >
                <option value="">Select range</option>
                {employeeRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={profileData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Address</label>
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Business Street, City, State 12345"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Number</label>
              <input
                type="text"
                value={profileData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                placeholder="Company registration number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tax ID</label>
              <input
                type="text"
                value={profileData.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                placeholder="Tax identification number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={handleSaveChanges}
            disabled={isSaving || !hasChanges}
            className="px-6 py-3 bg-gradient-to-r from-[#008200] to-[#00B300] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
          <button
            onClick={() => {
              if (originalData) {
                setProfileData(originalData);
              }
              setHasChanges(false);
              setSaveError('');
              setSaveSuccess(false);
            }}
            disabled={isSaving}
            className="px-6 py-3 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition-all duration-300 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Account Status Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <h3 className="text-2xl font-black text-gray-900 mb-6">Account Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-bold text-gray-900">Account Status</h4>
              <p className="text-sm text-gray-600 mt-1">Verification pending - under review</p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-semibold rounded-full">Pending</span>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-bold text-gray-900">Member Since</h4>
              <p className="text-sm text-gray-600 mt-1">Account creation date</p>
            </div>
            <span className="text-sm font-semibold text-gray-900">{new Date().toLocaleDateString()}</span>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-bold text-gray-900">Membership Tier</h4>
              <p className="text-sm text-gray-600 mt-1">Current plan and benefits</p>
            </div>
            <span className="text-sm font-semibold text-[#008200]">Enterprise</span>
          </div>
        </div>
      </div>
    </div>
  );
}
