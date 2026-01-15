'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface MembershipCardProps {
  planType: 'individual' | 'corporate';
  planName: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

export function MembershipCard({
  planType,
  planName,
  price,
  features,
  recommended = false,
}: MembershipCardProps) {
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/memberships');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/memberships/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType,
          priceAmount: price,
          planName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe checkout
      const { sessionId } = data;
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-xl p-8 border-2 transition-all ${
        recommended
          ? 'border-green-500 bg-gradient-to-br from-green-50 to-white shadow-lg scale-105'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      {recommended && (
        <div className="mb-4">
          <span className="inline-block bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
            ⭐ Most Popular
          </span>
        </div>
      )}

      <h3 className="text-2xl font-bold text-gray-900 mb-2">{planName}</h3>

      <div className="mb-6">
        <span className="text-5xl font-bold text-gray-900">${price}</span>
        <span className="text-gray-600 ml-2">one-time payment</span>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-bold text-white mb-6 transition-all ${
          recommended
            ? 'bg-green-600 hover:bg-green-700 disabled:bg-gray-400'
            : 'bg-[#008200] hover:bg-[#006600] disabled:bg-gray-400'
        }`}
      >
        {loading ? 'Processing...' : 'Choose Plan'}
      </button>

      <ul className="space-y-3">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="text-green-500 font-bold mt-1">✓</span>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
