import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import IndividualProfileModel from '@/server/db/models/individualProfile.model';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await getServerAuthSession();

  if (!session || session.user?.role !== 'INDIVIDUAL') {
    redirect('/auth/signin');
  }

  await connectToDatabase();
  const profile = await IndividualProfileModel.findOne({ userId: session.user.id }).lean();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and account settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-[#008200] to-[#00B300] rounded-full flex items-center justify-center text-5xl">
            👤
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900">
              {profile?.firstName && profile?.lastName 
                ? `${profile.firstName} ${profile.lastName}` 
                : 'Complete Your Profile'}
            </h2>
            <p className="text-gray-600 mt-1">{session.user?.email}</p>
            <p className="text-sm text-gray-500 mt-2">Member since: January 2, 2026</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 border-t border-gray-200 pt-8">
          {/* Personal Details Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                defaultValue={profile?.firstName || ''}
                placeholder="Enter first name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                defaultValue={profile?.lastName || ''}
                placeholder="Enter last name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={session.user?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Primary email (cannot be changed)</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                defaultValue={profile?.dob ? new Date(profile.dob).toISOString().split('T')[0] : ''}
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
                defaultValue={profile?.bio || ''}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Interests / Areas of Learning</label>
              <input
                type="text"
                placeholder="e.g., Web Development, Business, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Qualifications</label>
              <input
                type="text"
                placeholder="e.g., BSc Computer Science, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
          <button className="px-6 py-3 bg-gradient-to-r from-[#008200] to-[#00B300] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50">
            Save Changes
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
              <h4 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">Profile Picture</h4>
              <p className="text-sm text-gray-600">Upload or change your profile picture</p>
            </div>
            <span className="text-2xl">📸</span>
          </button>
        </div>
      </div>
    </div>
  );
}
