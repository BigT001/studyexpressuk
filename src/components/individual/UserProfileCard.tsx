"use client";
import Image from "next/image";

interface UserProfileCardProps {
  profileImage?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
}

export function UserProfileCard({ profileImage, firstName, lastName, bio }: UserProfileCardProps) {
  return (
    <div className="flex items-center gap-6 mb-6">
      <div className="flex-shrink-0 flex items-center justify-center" style={{ minWidth: 180, minHeight: 180 }}>
        {profileImage ? (
          <div style={{ width: 180, height: 180, borderRadius: '50%', overflow: 'hidden', border: '4px solid #60a5fa', boxShadow: '0 4px 16px 0 rgba(0,0,0,0.06)' }}>
            <Image
              src={profileImage}
              alt="Profile"
              width={180}
              height={180}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              className="select-none"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-44 h-44 rounded-full bg-gray-200 flex items-center justify-center text-6xl text-gray-400 border-4 border-blue-200 shadow-lg" style={{ borderRadius: '50%' }}>
            <span>👤</span>
          </div>
        )}
      </div>
      <div>
        <div className="font-bold text-xl text-gray-900 mb-1">
          {firstName || lastName ? `${firstName || ''} ${lastName || ''}`.trim() : 'Your Name'}
        </div>
        {bio ? (
          <div className="text-gray-700 text-sm max-w-xl whitespace-pre-line">{bio}</div>
        ) : (
          <div className="text-gray-400 text-sm">No bio added yet.</div>
        )}
      </div>
    </div>
  );
}
