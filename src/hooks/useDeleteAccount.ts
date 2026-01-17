import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteAccountOptions {
  userType?: 'individual' | 'corporate' | 'subadmin'; // Defaults to 'individual'
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useDeleteAccount(options: DeleteAccountOptions = {}) {
  const { userType = 'individual', onSuccess, onError } = options;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAccount = async (password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          userType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Failed to delete account';
        setError(errorMessage);
        onError?.(errorMessage);
        return false;
      }

      // Account deleted successfully
      onSuccess?.();
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push('/');
      }, 1000);

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteAccount,
    loading,
    error,
    setError,
  };
}
