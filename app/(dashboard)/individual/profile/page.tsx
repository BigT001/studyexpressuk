'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import CloudinaryUpload from '@/components/CloudinaryUpload';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  bio: string;
  interests: string;
  qualifications: string;
  profileImage: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function SuccessModal({ open, onClose, message }: { open: boolean; onClose: () => void; message: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center border border-green-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="text-lg font-bold text-gray-900 mb-1 text-center">{message}</div>
        <p className="text-sm text-gray-500 text-center mb-6">All changes have been saved successfully</p>
        <button
          className="w-full px-4 py-2.5 bg-gradient-to-r from-[#008200] to-[#00B300] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          onClick={onClose}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const isStaff = session?.user?.role === 'STAFF';
  const pageTitle = isStaff ? 'Staff Profile' : 'My Profile';
  const pageDescription = isStaff ? 'Manage your staff profile and account information' : 'Manage your personal information and account settings';
  
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    bio: '',
    interests: '',
    qualifications: '',
    profileImage: '',
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/users/profile');
      const result = await res.json();

      console.log('[Profile Page] API Response:', result);

      if (!res.ok) {
        setErrorMessage(result.error || 'Failed to load profile');
        return;
      }

      console.log('[Profile Page] Setting profile data:', result.data);
      setProfileData(result.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrorMessage('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setErrorMessage('');
      setSuccessMessage('');

      console.log('Saving profile with data:', profileData);

      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const result = await res.json();
      console.log('Profile save response:', result);

      if (!res.ok) {
        setErrorMessage(result.error || 'Failed to save profile');
        return;
      }

      setSuccessMessage('Profile updated successfully!');
      setShowSuccessModal(true);
      setHasChanges(false);
      // Reload profile data to confirm save
      await fetchProfileData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('Failed to save profile: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setIsChangingPassword(true);
      setErrorMessage('');
      setSuccessMessage('');

      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        setErrorMessage('All fields are required');
        setIsChangingPassword(false);
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setErrorMessage('New passwords do not match');
        setIsChangingPassword(false);
        return;
      }

      const res = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMessage(result.error || 'Failed to change password');
        return;
      }

      setSuccessMessage('Password changed successfully!');
      setShowSuccessModal(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
      setTimeout(() => setShowPasswordModal(false), 1500);
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008200]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
          <h1 className="text-4xl font-black mb-2">{pageTitle}</h1>
          <p className="text-blue-100 text-lg">{pageDescription}</p>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 flex items-center gap-3 shadow-sm">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold flex-1">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 flex items-center gap-3 shadow-sm">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold flex-1">{errorMessage}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 overflow-hidden">
          {/* Profile Image Upload */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <CloudinaryUpload
              folder="users"
              onUploadSuccess={(url) => {
                setProfileData({ ...profileData, profileImage: url });
                setHasChanges(true);
              }}
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
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-xl">👤</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Name cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Name cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Primary email (cannot be changed)</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  placeholder="e.g., +1 (555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={profileData.dob}
                  onChange={(e) => handleProfileChange('dob', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent"
                />
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-xl">📋</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Additional Information</h3>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio / About You</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">{profileData.bio.length}/500 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Interests / Areas of Learning</label>
                <input
                  type="text"
                  value={profileData.interests}
                  onChange={(e) => handleProfileChange('interests', e.target.value)}
                  placeholder="e.g., Web Development, Business, Design..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple interests with commas</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Qualifications</label>
                <input
                  type="text"
                  value={profileData.qualifications}
                  onChange={(e) => handleProfileChange('qualifications', e.target.value)}
                  placeholder="e.g., BSc Computer Science, MBA..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving || !hasChanges}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#008200] to-[#00B300] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin">⏳</span> Saving...
                </>
              ) : (
                <>
                  <span>✓</span> Save Changes
                </>
              )}
            </button>
            <button
              onClick={() => {
                fetchProfileData();
                setHasChanges(false);
              }}
              className="px-6 py-3 bg-gray-100 text-gray-900 font-bold rounded-lg hover:bg-gray-200 transition-all duration-300"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Security & Account Settings - Only for Individual Members */}
        {!isStaff && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900">Security & Account</h3>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between p-5 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <div className="text-left">
                  <h4 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">Change Password</h4>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </div>
                <span className="text-3xl">🔐</span>
              </button>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">🔐</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900">Change Password</h3>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value });
                      setErrorMessage('');
                    }}
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                      setErrorMessage('');
                    }}
                    placeholder="Enter new password (min 8 characters)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
                      setErrorMessage('');
                    }}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setErrorMessage('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span> Changing...
                    </span>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        <SuccessModal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} message="Profile updated successfully!" />
      </div>
    </>
  );
}
