import { useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UseEnrollmentOptions {
  onConfirm?: () => void;
  onCancel?: () => void;
  onError?: (error: string) => void;
}

export function useEnrollment(options?: UseEnrollmentOptions) {
  const { status } = useSession();
  const router = useRouter();

  /**
   * Check if user is logged in and active
   */
  const isUserActive = useCallback((): boolean => {
    return status === 'authenticated';
  }, [status]);

  /**
   * Handle enrollment action with confirmation
   */
  const handleEnrollAction = useCallback(
    async (courseId: string, courseTitle: string): Promise<void> => {
      // Show confirmation dialog
      const confirmed = window.confirm(
        `Are you sure you want to enroll in ${courseTitle}?`
      );

      if (!confirmed) {
        options?.onCancel?.();
        return;
      }

      try {
        // Call enrollment API
        const response = await fetch('/api/enroll-course', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to enroll in course');
        }

        // Success - show confirmation and redirect
        options?.onConfirm?.();
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = `Successfully enrolled in ${courseTitle}!`;
        document.body.appendChild(notification);

        setTimeout(() => {
          notification.remove();
          // Redirect to individual enrollments page
          router.push('/individual/enrollments');
        }, 2000);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Enrollment failed. Please try again.';
        options?.onError?.(errorMessage);
      }
    },
    [options, router]
  );

  /**
   * Handle login redirect
   */
  const handleLoginRedirect = useCallback((): void => {
    router.push('/auth/signin');
  }, [router]);

  return {
    isUserActive,
    handleEnrollAction,
    handleLoginRedirect,
    status,
  };
}
