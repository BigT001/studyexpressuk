import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Announcements | Individual Dashboard',
  description: 'Platform announcements and broadcasts',
};

export default function AnnouncementsPage() {
  // Sample announcements data
  const announcements = [
    {
      id: 1,
      title: 'New Course: Advanced UK Immigration Law',
      content:
        'We are excited to announce a brand new course covering advanced topics in UK immigration law. Perfect for professionals and students interested in this field.',
      date: 'January 1, 2026',
      author: 'Admin Team',
      type: 'course',
      priority: 'high',
      image: '📚',
    },
    {
      id: 2,
      title: 'Platform Maintenance Scheduled',
      content:
        'Our platform will undergo scheduled maintenance on January 5, 2026 from 2:00 AM to 4:00 AM GMT. We apologize for any inconvenience.',
      date: 'December 30, 2025',
      author: 'System',
      type: 'maintenance',
      priority: 'medium',
      image: '🔧',
    },
    {
      id: 3,
      title: 'Upcoming Webinar: Study in UK 2026',
      content:
        'Join us for an exclusive webinar featuring university representatives from top UK institutions. Learn about admission requirements, scholarships, and student life.',
      date: 'December 28, 2025',
      author: 'Events Team',
      type: 'event',
      priority: 'high',
      image: '🎓',
    },
    {
      id: 4,
      title: 'Member Spotlight: Success Stories',
      content:
        'Read inspiring stories from our community members who have successfully studied in the UK. Learn from their experiences and get tips for your own journey.',
      date: 'December 25, 2025',
      author: 'Community',
      type: 'news',
      priority: 'normal',
      image: '⭐',
    },
    {
      id: 5,
      title: 'Limited Time: 50% Off Premium Membership',
      content:
        'Upgrade to Premium membership and get 50% off your first year. Unlock exclusive courses, priority support, and much more. Offer valid until December 31, 2025.',
      date: 'December 20, 2025',
      author: 'Marketing',
      type: 'promotion',
      priority: 'high',
      image: '🎉',
    },
  ];

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      course: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      event: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      news: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      promotion: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };
    return colors[type] || colors.news;
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
          <span className="mr-1 h-2 w-2 rounded-full bg-red-600"></span>
          Urgent
        </span>
      );
    }
    if (priority === 'medium') {
      return (
        <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
          <span className="mr-1 h-2 w-2 rounded-full bg-orange-600"></span>
          Important
        </span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Announcements</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Stay updated with the latest announcements and broadcasts from StudyExpressUK
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 overflow-x-auto dark:border-gray-700">
        <button className="border-b-2 border-[#008200] px-4 py-2 text-sm font-medium text-[#008200] whitespace-nowrap dark:text-[#00B300]">
          All
        </button>
        <button className="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 whitespace-nowrap dark:text-gray-400 dark:hover:text-gray-300">
          Courses
        </button>
        <button className="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 whitespace-nowrap dark:text-gray-400 dark:hover:text-gray-300">
          Events
        </button>
        <button className="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 whitespace-nowrap dark:text-gray-400 dark:hover:text-gray-300">
          News
        </button>
        <button className="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 whitespace-nowrap dark:text-gray-400 dark:hover:text-gray-300">
          Promotions
        </button>
      </div>

      {/* Announcements List */}
      <div className="grid gap-4 md:gap-6">
        {announcements.map((announcement) => (
          <Link
            key={announcement.id}
            href={`/individual/announcements/${announcement.id}`}
            className="group block rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-[#00B300] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-[#00B300]"
          >
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className="flex-shrink-0 text-2xl">{announcement.image}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getTypeColor(announcement.type)}`}
                  >
                    {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                  </span>
                  {getPriorityBadge(announcement.priority)}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#008200] dark:text-white dark:group-hover:text-[#00B300] transition-colors">
                  {announcement.title}
                </h3>

                <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
                  {announcement.content}
                </p>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>By {announcement.author}</span>
                  <span>{announcement.date}</span>
                </div>
              </div>

              {/* Arrow */}
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-[#008200] transition-colors dark:group-hover:text-[#00B300]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Subscribe Section */}
      <div className="rounded-lg border border-[#008200] bg-green-50 p-6 dark:border-[#00B300] dark:bg-green-900/20">
        <div className="flex items-start space-x-4">
          <svg
            className="h-6 w-6 flex-shrink-0 text-[#008200] dark:text-[#00B300]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2.5 3A1.5 1.5 0 001 4.5v.006c0 .023 0 .045.003.068A1.5 1.5 0 002.5 6h15A1.5 1.5 0 0019 4.574v-.006A1.5 1.5 0 0017.5 3h-15zm0 2.5h15v8A1.5 1.5 0 0117.5 15h-15A1.5 1.5 0 012.5 13.5v-8z" />
          </svg>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Get Notifications
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Enable notifications to receive announcements directly in your dashboard. You can manage notification preferences in your account settings.
            </p>
            <button className="mt-4 inline-flex items-center rounded-lg bg-[#008200] px-4 py-2 text-sm font-medium text-white hover:bg-[#007000] focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition-colors">
              Enable Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
