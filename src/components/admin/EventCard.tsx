interface EventCardProps {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  access: 'free' | 'premium' | 'corporate';
  startDate?: string;
  location?: string;
  currentEnrollment?: number;
  maxCapacity?: number;
  imageUrl?: string;
  onEdit: () => void;
  onPermissions: () => void;
}

export default function EventCard({
  title,
  description,
  category,
  status,
  access,
  startDate,
  location,
  currentEnrollment = 0,
  maxCapacity,
  imageUrl,
  onEdit,
  onPermissions,
}: EventCardProps) {
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
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
      {/* Image Section */}
      {imageUrl && (
        <div className="relative w-full h-40 overflow-hidden bg-gray-200">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
        {category && (
          <p className="text-xs text-gray-600 mt-1">{category}</p>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-4">
        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        )}

        {/* Status and Access Badges */}
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <span className={`inline-flex text-xs font-semibold px-3 py-1 rounded-full border ${getAccessColor(access)}`}>
            {access.charAt(0).toUpperCase() + access.slice(1)}
          </span>
        </div>

        {/* Enrollment Progress */}
        {maxCapacity && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600 font-medium">Enrollment</span>
              <span className="text-xs text-gray-700 font-semibold">
                {currentEnrollment}/{maxCapacity}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${calculateCapacityPercentage()}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Date and Location */}
        <div className="space-y-2 pt-2">
          {startDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-lg">📅</span>
              <span>{formatDate(startDate)}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-lg">📍</span>
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer - Action Buttons */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3">
        <button
          onClick={onEdit}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          Edit
        </button>
        <button
          onClick={onPermissions}
          className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
        >
          Permissions
        </button>
      </div>
    </div>
  );
}
