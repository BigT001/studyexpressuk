import React from 'react';

export interface RegisterEventFormProps {
  eventId?: string;
  sessionUser: any;
  onSuccess: () => void;
}

export function RegisterEventForm({ eventId, sessionUser, onSuccess }: RegisterEventFormProps) {
  const [firstName, setFirstName] = React.useState(sessionUser.firstName || '');
  const [lastName, setLastName] = React.useState(sessionUser.lastName || '');
  const [phone, setPhone] = React.useState(sessionUser.phone || '');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // Fetch latest user profile from API and prefill fields if available
  React.useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/users/profile');
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.data) {
          if (data.data.firstName) setFirstName(data.data.firstName);
          if (data.data.lastName) setLastName(data.data.lastName);
          if (data.data.phone) setPhone(data.data.phone);
        }
      } catch (e) {
        // ignore
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/register-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        firstName,
        lastName,
        email: sessionUser.email,
        phone,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      onSuccess();
    } else {
      setError(data.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className="border rounded px-3 py-2 w-1/2"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className="border rounded px-3 py-2 w-1/2"
          required
        />
      </div>
      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        className="border rounded px-3 py-2 w-full"
        required
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all duration-300 w-full"
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Confirm Registration'}
      </button>
    </form>
  );
}