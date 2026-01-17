'use client';

import React, { useState } from 'react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<boolean>;
  loading?: boolean;
  error?: string | null;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  error = null,
}: DeleteAccountModalProps) {
  const [step, setStep] = useState<'confirm' | 'password'>('confirm');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleConfirmClick = () => {
    setStep('password');
    setPassword('');
    setPasswordError('');
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      setPasswordError('Please enter your password');
      return;
    }

    const success = await onConfirm(password);
    if (success) {
      // Reset and close
      setStep('confirm');
      setPassword('');
      setPasswordError('');
      onClose();
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleCancel = () => {
    setStep('confirm');
    setPassword('');
    setPasswordError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {step === 'confirm' ? (
          <>
            <h2 className="text-xl font-bold text-gray-900">Delete Account?</h2>
            <p className="mt-2 text-sm text-gray-600">
              This action cannot be undone. Your account and all associated data will be permanently deleted from our servers.
            </p>
            <p className="mt-3 text-sm font-semibold text-red-600">
              Are you absolutely sure?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClick}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900">Confirm Your Password</h2>
            <p className="mt-2 text-sm text-gray-600">
              To delete your account, please enter your password for verification.
            </p>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handlePasswordSubmit();
                  }
                }}
                placeholder="Enter your password"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                disabled={loading}
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
              )}
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                disabled={loading}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
