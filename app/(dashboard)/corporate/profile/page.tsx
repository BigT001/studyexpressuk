'use client';

import { useState } from 'react';
import CloudinaryUpload from '@/components/CloudinaryUpload';

interface CorporateProfileData {
  companyName: string;
  email: string;
  phone: string;
  industry: string;
  employees: string;
  website: string;
  address: string;
  bio: string;
  profileImage: string;
}

export default function CorporateProfilePage() {
  const [profileData, setProfileData] = useState<CorporateProfileData>({
    companyName: '',
    email: 'company@example.com',
    phone: '',
    industry: '',
    employees: '',
    website: '',
    address: '',
    bio: '',
    profileImage: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      // API call would go here
      console.log('Saving profile:', profileData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-gray-900 mb-2">Company Profile</h1>
        <p className="text-gray-600">Manage your company information and corporate account settings</p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          ✓ Profile updated successfully!
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        {/* Company Logo Upload */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <CloudinaryUpload
            folder="users"
            onUploadSuccess={(url) => setProfileData({ ...profileData, profileImage: url })}
            currentImage={profileData.profileImage}
            label="Company Logo / Profile Picture"
            width={140}
            height={140}
            buttonText="🏢 Upload Company Logo"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Company Information Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Company Information</h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                value={profileData.companyName}
                onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                placeholder="Enter company name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Primary email (cannot be changed)</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="Enter contact number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
              <select
                value={profileData.industry}
                onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
              >
                <option value="">Select an industry</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Business Details</h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Employees</label>
              <select
                value={profileData.employees}
                onChange={(e) => setProfileData({ ...profileData, employees: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
              >
                <option value="">Select range</option>
                <option value="1-50">1-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={profileData.website}
                onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                placeholder="Enter business address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell us about your company..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="px-6 py-3 bg-gradient-to-r from-[#008200] to-[#00B300] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button className="px-6 py-3 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition-all duration-300">
            Cancel
          </button>
        </div>
      </div>

      {/* Team & Access Settings */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <h3 className="text-2xl font-black text-gray-900 mb-6">Team & Access</h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="text-left">
              <h4 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">Manage Team Members</h4>
              <p className="text-sm text-gray-600">Add or remove team members from your account</p>
            </div>
            <span className="text-2xl">👥</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="text-left">
              <h4 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">Access Control</h4>
              <p className="text-sm text-gray-600">Manage permissions and access levels</p>
            </div>
            <span className="text-2xl">🔑</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="text-left">
              <h4 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">Security Settings</h4>
              <p className="text-sm text-gray-600">Configure security and compliance settings</p>
            </div>
            <span className="text-2xl">⚙️</span>
          </button>
        </div>
      </div>
    </div>
  );
}
