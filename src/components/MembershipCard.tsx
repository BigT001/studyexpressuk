'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Star, Zap } from 'lucide-react';

interface MembershipCardProps {
  planId?: string;
  planType: 'individual' | 'corporate';
  planName: string;
  price: number;
  features: string[];
  recommended?: boolean;
  isCurrentPlan?: boolean;
  billingInterval?: string;
}

export function MembershipCard({
  planId,
  planType,
  planName,
  price,
  features,
  recommended = false,
  isCurrentPlan = false,
  billingInterval = 'lifetime',
}: MembershipCardProps) {
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (isCurrentPlan) return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/individual/memberships');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/memberships/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          planType,
          priceAmount: price,
          planName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const { sessionId } = data;
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isPremium = planName.toLowerCase().includes('premium') || recommended;

  return (
    <div
      className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col h-full ${
        isPremium
          ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 border text-white shadow-2xl scale-105 border-white/20'
          : 'bg-white border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl'
      }`}
    >
      {isPremium && (
        <div className="absolute -top-4 right-8 bg-gradient-to-r from-teal-400 to-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-current" />
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className={`text-2xl font-black tracking-tight mb-2 uppercase ${isPremium ? 'text-white' : 'text-gray-900'}`}>
          {planName}
        </h3>
        <p className={`text-sm ${isPremium ? 'text-blue-200' : 'text-gray-500'}`}>
          Unlock exclusive features and content.
        </p>
      </div>

      <div className="mb-8 flex items-baseline gap-1">
        <span className="text-5xl font-black tracking-tighter">${price}</span>
        <span className={`text-sm font-medium ${isPremium ? 'text-blue-200' : 'text-gray-500'}`}>
          /{billingInterval}
        </span>
      </div>

      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${isPremium ? 'text-teal-400' : 'text-blue-600'}`} />
            <span className={`text-sm leading-tight ${isPremium ? 'text-blue-50' : 'text-gray-700'}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        disabled={loading || isCurrentPlan}
        className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
          isCurrentPlan
            ? 'bg-gray-100/10 text-gray-400 cursor-not-allowed border-2 border-dashed border-gray-300'
            : isPremium
            ? 'bg-white text-blue-900 hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30'
        }`}
      >
        {loading ? (
          'Processing...'
        ) : isCurrentPlan ? (
           <>
            <CheckCircle2 className="w-5 h-5" /> Current Plan
           </>
        ) : (
          <>
            <Zap className="w-4 h-4" /> Choose Plan
          </>
        )}
      </button>
    </div>
  );
}
