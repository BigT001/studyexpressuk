'use client';

import { useState } from 'react';

interface ContentItem {
  id: string;
  title: string;
  type: 'course' | 'event' | 'training';
  status: 'draft' | 'published' | 'archived';
  accessLevel: 'free' | 'premium';
  createdDate: string;
}

export function ContentManagement() {
  const [contents, setContents] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Advanced Leadership Program',
      type: 'course',
      status: 'published',
      accessLevel: 'premium',
      createdDate: '2025-11-01',
    },
    {
      id: '2',
      title: 'UK Business Summit 2026',
      type: 'event',
      status: 'published',
      accessLevel: 'free',
      createdDate: '2025-10-15',
    },
  ]);

  const [filterType, setFilterType] = useState<'all' | 'course' | 'event' | 'training'>(
    'all'
  );

  const filteredContents =
    filterType === 'all'
      ? contents
      : contents.filter((item) => item.type === filterType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            Create New
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {['all', 'course', 'event', 'training'].map((type) => (
            <button
              key={type}
              onClick={() =>
                setFilterType(type as 'all' | 'course' | 'event' | 'training')
              }
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === type
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Access Level
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Created Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredContents.map((content) => (
              <tr key={content.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {content.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                  {content.type}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      content.accessLevel === 'premium'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {content.accessLevel}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      content.status
                    )}`}
                  >
                    {content.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(content.createdDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors">
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
