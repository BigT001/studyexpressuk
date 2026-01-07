import Link from 'next/link';
import Image from 'next/image';

interface PublicCourseCardProps {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  price?: number;
  instructor?: string;
  imageUrl?: string;
}

export default function PublicCourseCard({
  _id,
  title,
  description,
  category,
  level,
  duration,
  price,
  instructor,
  imageUrl,
}: PublicCourseCardProps) {
  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-emerald-100 text-emerald-800';
      case 'intermediate':
        return 'bg-amber-100 text-amber-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{title}</h3>
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

        {/* Level Badge */}
        {level && (
          <div className="flex gap-2">
            <span className={`inline-flex text-xs font-semibold px-3 py-1 rounded-full ${getLevelColor(level)}`}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </span>
          </div>
        )}

        {/* Instructor */}
        {instructor && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Instructor</p>
            <p className="text-sm font-bold text-gray-900 line-clamp-1">{instructor}</p>
          </div>
        )}

        {/* Course Details */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          {duration && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duration:</span>
              <span className="font-semibold text-gray-900">{duration}h</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-semibold" style={{ color: '#008200' }}>
              {price ? `$${price}` : 'Free'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer - Enroll Button */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-100">
        <Link
          href="/auth/signin"
          className="block w-full px-4 py-3 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm text-center"
          style={{ backgroundColor: '#008200' }}
        >
          Enroll Now
        </Link>
      </div>
    </div>
  );
}
