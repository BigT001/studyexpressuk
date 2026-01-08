"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface User {
  _id: string;
  email: string;
  phone?: string;
  role: "INDIVIDUAL" | "CORPORATE" | "SUB_ADMIN" | "ADMIN";
  status: "subscribed" | "not-subscribed";
  createdAt: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
}

interface Profile {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  companyName?: string;
  logo?: string;
  [key: string]: any;
}

interface Enrollment {
  eventId: string;
  status: string;
  [key: string]: any;
}

interface EventOrCourse {
  _id: string;
  title: string;
  type?: string;
  imageUrl?: string;
  [key: string]: any;
}

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [events, setEvents] = useState<EventOrCourse[]>([]);
  const [courses, setCourses] = useState<EventOrCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data.user || null);
        setProfile(data.profile || null);
        setEnrollments(data.enrollments || []);
        setEvents(data.events || []);
        setCourses(data.courses || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchUser();
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/users" className="text-blue-600 hover:underline text-lg">← Back to Users</Link>
        {user && (
          <Link href={`/admin/users/${user._id}/chat`} className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Open Chat</Link>
        )}
      </div>
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight">User Details</h1>
      {loading ? (
        <div className="text-center py-16 text-gray-500 text-lg">Loading user...</div>
      ) : error ? (
        <div className="text-center py-16 text-red-500 text-lg">{error}</div>
      ) : user ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 flex flex-col gap-8">
          {/* Profile Card */}
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <img
              src={profile?.avatar || profile?.logo || user.profileImage || "/default-avatar.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-md"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold">
                  {profile?.firstName || user.firstName} {profile?.lastName || user.lastName || profile?.companyName || ""}
                </span>
                {user.role !== 'INDIVIDUAL' && profile?.companyName && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">{profile.companyName}</span>
                )}
                <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${user.status === 'subscribed' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{user.status}</span>
                <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">{user.role}</span>
              </div>
              <div className="text-gray-700 dark:text-gray-300 mb-1"><span className="font-medium">Email:</span> {user.email}</div>
              <div className="text-gray-700 dark:text-gray-300 mb-1"><span className="font-medium">Phone:</span> {user.phone || "-"}</div>
              <div className="text-gray-700 dark:text-gray-300 mb-1"><span className="font-medium">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</div>
              {/* Show bio/description if available */}
              {profile?.bio && (
                <div className="mt-2 text-gray-600 dark:text-gray-400 italic">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Description:</span> {profile.bio}
                </div>
              )}
              {profile?.description && !profile.bio && (
                <div className="mt-2 text-gray-600 dark:text-gray-400 italic">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Description:</span> {profile.description}
                </div>
              )}
            </div>
          </div>
          {/* Divider */}
          <hr className="my-2 border-gray-200 dark:border-gray-700" />
          {/* Events & Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Registered Events */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>Registered Events</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">{events.length}</span>
              </h2>
              {events.length === 0 ? (
                <div className="text-gray-400">No registered events.</div>
              ) : (
                <ul className="space-y-3">
                  {events.map(ev => (
                    <li key={ev._id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700">
                      {ev.imageUrl && <img src={ev.imageUrl} alt={ev.title} className="w-14 h-14 rounded object-cover border" />}
                      <div>
                        <div className="font-medium text-base">{ev.title}</div>
                        {ev.type && <div className="text-xs text-gray-500">{ev.type}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Enrolled Courses */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>Enrolled Courses</span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">{courses.length}</span>
              </h2>
              {courses.length === 0 ? (
                <div className="text-gray-400">No enrolled courses.</div>
              ) : (
                <ul className="space-y-3">
                  {courses.map(course => (
                    <li key={course._id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700">
                      {course.imageUrl && <img src={course.imageUrl} alt={course.title} className="w-14 h-14 rounded object-cover border" />}
                      <div>
                        <div className="font-medium text-base">{course.title}</div>
                        {course.type && <div className="text-xs text-gray-500">{course.type}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {/* Divider */}
          <hr className="my-2 border-gray-200 dark:border-gray-700" />
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500 text-lg">User not found.</div>
      )}
    </div>
  );
}
