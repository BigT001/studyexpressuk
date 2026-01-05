'use client';

import { useState } from 'react';
import CloudinaryUpload from '@/components/CloudinaryUpload';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  bio: string;
  interests: string;
  qualifications: string;
  profileImage: string;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: 'user@example.com',
    dob: '',
    bio: '',
    interests: '',
    qualifications: '',
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
        <h1 className="text-4xl font-black text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and account settings</p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          ✓ Profile updated successfully!
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        {/* Profile Image Upload */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <CloudinaryUpload
            folder="users"
            onUploadSuccess={(url) => setProfileData({ ...profileData, profileImage: url })}
            currentImage={profileData.profileImage}
            label="Profile Picture"
            width={120}
            height={120}
            buttonText="📸 Upload Profile Photo"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Details Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                placeholder="Enter first name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                placeholder="Enter last name"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                value={profileData.dob}
                onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
              />
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Additional Information</h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bio / About You</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Interests / Areas of Learning</label>
              <input
                type="text"
                value={profileData.interests}
                onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
                placeholder="e.g., Web Development, Business, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Qualifications</label>
              <input
                type="text"
                value={profileData.qualifications}
                onChange={(e) => setProfileData({ ...profileData, qualifications: e.target.value })}
                placeholder="e.g., BSc Computer Science, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
              />
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

      {/* Security & Account Settings */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <h3 className="text-2xl font-black text-gray-900 mb-6">Security & Account</h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="text-left">
              <h4 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">Change Password</h4>
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
            <span className="text-2xl">🔐</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="text-left">
              <h4 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">Security Settings</h4>
              <p className="text-sm text-gray-600">Manage security preferences</p>
            </div>
            <span className="text-2xl">⚙️</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="text-left">
              <h4 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">Activity Log</h4>
              <p className="text-sm text-gray-600">View your account activity</p>
            </div>
            <span className="text-2xl">📊</span>
          </button>
        </div>
      </div>
    </div>
  );
}
