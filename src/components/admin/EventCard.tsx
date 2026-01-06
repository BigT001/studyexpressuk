interface EventCardProps {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  access: 'free' | 'premium' | 'corporate';
  format?: 'online' | 'offline' | 'hybrid';
  startDate?: string;
  location?: string;
  currentEnrollment?: number;
  maxCapacity?: number;
  imageUrl?: string;
  onEdit: () => void;
  onPermissions: () => void;
  onDelete: () => void;
}

export default function EventCard({
  title,
  description,
  category,
  status,
  access,
  format,
  startDate,
  location,
  currentEnrollment = 0,
  maxCapacity,
  imageUrl,
  onEdit,
  onPermissions,
  onDelete,
}: EventCardProps) {
  console.log(`EventCard ${title} - format prop:`, format);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'published':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'completed':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getAccessColor = (access: string) => {
    switch (access) {
      case 'free':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'premium':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'corporate':
        return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getFormatColor = (format: string | undefined) => {
    switch (format) {
      case 'online':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'offline':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'hybrid':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getFormatLabel = (format: string | undefined) => {
    switch (format) {
      case 'online':
        return '🌐 Online';
      case 'offline':
        return '📍 Offline';
      case 'hybrid':
        return '🔄 Hybrid';
      default:
        return '🌐 Online'; // Default to online for old events without format
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateCapacityPercentage = () => {
    if (!maxCapacity) return 0;
    return Math.round((currentEnrollment / maxCapacity) * 100);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col h-full">
      {/* Image Section with Overlay */}
      {imageUrl && (
        <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-blue-300 to-blue-500">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/50 transition-colors duration-300"></div>
        </div>
      )}

      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{title}</h3>
        {category && (
          <p className="text-xs text-gray-600 mt-2 font-semibold uppercase tracking-wide">{category}</p>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        )}

        {/* Status and Access Badges Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`p-2 rounded-lg border ${getStatusColor(status)}`}>
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Status</p>
            <p className="text-sm font-bold">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
          </div>
          <div className={`p-2 rounded-lg border ${getAccessColor(access)}`}>
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Access</p>
            <p className="text-sm font-bold">{access.charAt(0).toUpperCase() + access.slice(1)}</p>
          </div>
        </div>

        {/* Format Badge */}
        {format && (
          <div className={`p-2 rounded-lg border ${getFormatColor(format)}`}>
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Format</p>
            <p className="text-sm font-bold">{getFormatLabel(format)}</p>
          </div>
        )}

        {/* Enrollment Progress */}
        {maxCapacity && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Enrollment</span>
              <span className="text-xs font-bold text-gray-900">{calculateCapacityPercentage()}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${calculateCapacityPercentage()}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 font-semibold">{currentEnrollment}/{maxCapacity} enrolled</p>
          </div>
        )}

        {/* Date and Location */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          {startDate && (
            <div className="flex items-center gap-3">
              <span className="text-lg">📅</span>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Date</p>
                <p className="text-sm font-bold text-gray-900">{formatDate(startDate)}</p>
              </div>
            </div>
          )}
          {location && (
            <div className="flex items-start gap-3">
              <span className="text-lg">📍</span>
              <div className="flex-grow">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Location</p>
                <p className="text-sm font-bold text-gray-900 line-clamp-1">{location}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer - Action Buttons */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-100 flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold text-sm hover:shadow-lg"
        >
          Edit
        </button>
        <button
          onClick={onPermissions}
          className="flex-1 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition-all duration-300 font-semibold text-sm hover:shadow-lg"
        >
          Perms
        </button>
        <button
          onClick={onDelete}
          className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold text-sm hover:shadow-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
