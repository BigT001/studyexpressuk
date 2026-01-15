'use client';

import { MembershipCard } from '@/components/MembershipCard';

export default function MembershipsPage() {
  const plans = [
    {
      planType: 'individual' as const,
      planName: 'Individual Plan',
      price: 200,
      features: [
        'Access to all courses',
        'Certificate of completion',
        'Lifetime access to course materials',
        '24/7 email support',
        'Monthly webinars and live sessions',
        'Community forum access',
      ],
    },
    {
      planType: 'corporate' as const,
      planName: 'Corporate Plan',
      price: 600,
      features: [
        'Unlimited team members',
        'Admin dashboard & analytics',
        'Custom course paths',
        'Dedicated account manager',
        'Priority support',
        'Team progress tracking',
        'Custom integrations',
        'Annual training audit',
      ],
      recommended: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get unlimited access to courses, certifications, and expert support
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {plans.map((plan) => (
            <MembershipCard key={plan.planType} {...plan} />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                We offer a 7-day free trial for all new users. Start learning today at no cost!
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express) and other payment methods through Stripe.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                Yes! We offer a 30-day money-back guarantee if you're not satisfied with your membership.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Is my payment information secure?
              </h3>
              <p className="text-gray-600">
                Absolutely! We use Stripe for payment processing, which uses industry-leading encryption and security standards.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Can I add team members to my corporate account?
              </h3>
              <p className="text-gray-600">
                Yes! Corporate plans include unlimited team member access. You can manage all members from your admin dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Have questions? We're here to help!
          </p>
          <a
            href="mailto:support@studyexpressuk.com"
            className="inline-block bg-[#008200] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#006600] transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
