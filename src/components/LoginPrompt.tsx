import { LogIn, X } from 'lucide-react';

interface LoginPromptProps {
  isOpen: boolean;
  courseName: string;
  onLogin: () => void;
  onClose: () => void;
}

/**
 * Login Prompt Modal
 * Displayed when unauthenticated user tries to enroll
 */
export function LoginPrompt({
  isOpen,
  courseName,
  onLogin,
  onClose,
}: LoginPromptProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="bg-green-100 rounded-full p-4">
              <LogIn className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Login to Continue
            </h2>
            <p className="text-gray-600 mt-2">
              You need to be logged in to enroll in{' '}
              <span className="font-semibold text-gray-900">{courseName}</span>
            </p>
          </div>

          {/* Message */}
          <p className="text-sm text-gray-600">
            If you don&apos;t have an account yet, you can create one during the login process.
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onLogin}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
