interface CourseCardProps {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'active' | 'archived';
  duration?: number;
  price?: number;
  instructor?: string;
  enrolledCount?: number;
  imageUrl?: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CourseCard({
  title,
  description,
  category,
  level,
  status,
  duration,
  price,
  instructor,
  enrolledCount = 0,
  imageUrl,
  onEdit,
  onDelete,
}: CourseCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'published':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'archived':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getLevelColor = (level: string | undefined) => {
    switch (level) {
      case 'beginner':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'intermediate':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'advanced':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getLevelLabel = (level: string | undefined) => {
    switch (level) {
      case 'beginner':
        return '🌱 Beginner';
      case 'intermediate':
        return '📚 Intermediate';
      case 'advanced':
        return '🎯 Advanced';
      default:
        return '📚 All Levels';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col h-full">
      {/* Image Section with Overlay */}
      <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : null}
        {!imageUrl && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-300 to-green-500 text-white">
            <span className="text-5xl">📚</span>
            <span className="text-sm font-semibold mt-2">No Image</span>
          </div>
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/50 transition-colors duration-300 pointer-events-none"></div>
      </div>

      {/* Card Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-5 border-b border-gray-100">
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

        {/* Status and Level Badges Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`p-2 rounded-lg border ${getStatusColor(status)}`}>
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Status</p>
            <p className="text-sm font-bold">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
          </div>
          {level && (
            <div className={`p-2 rounded-lg border ${getLevelColor(level)}`}>
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Level</p>
              <p className="text-sm font-bold">{getLevelLabel(level)}</p>
            </div>
          )}
        </div>

        {/* Instructor Badge */}
        {instructor && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Instructor</p>
            <p className="text-sm font-bold text-gray-900 line-clamp-1">{instructor}</p>
          </div>
        )}

        {/* Course Details */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          {duration && (
            <div className="flex items-center gap-3">
              <span className="text-lg">⏱️</span>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Duration</p>
                <p className="text-sm font-bold text-gray-900">{duration} hours</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <span className="text-lg">💰</span>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Price</p>
              <p className="text-sm font-bold text-gray-900">
                {price ? `$${price}` : 'Free'}
              </p>
            </div>
          </div>
          {enrolledCount > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-lg">👥</span>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Enrolled</p>
                <p className="text-sm font-bold text-gray-900">{enrolledCount} students</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer - Action Buttons */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-100 flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-all duration-300 font-semibold text-sm hover:shadow-lg"
          style={{ backgroundColor: '#008200' }}
        >
          Edit
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
