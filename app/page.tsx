import Link from 'next/link';
import { HeroSection } from '@/components/HeroSection';
import { ExploreAll } from '@/components/ExploreAll';
import { ExploreCoursesSection } from '@/components/ExploreCoursesSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Explore Courses Section */}
      <ExploreCoursesSection />

      {/* Explore All Section */}
      <ExploreAll />

      {/* Corporate Component */}


      {/* Get Certified Section */}
      <section id="certified" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Unlock Your Potential with <span className="text-blue-600">Accredited Learning</span>
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Our certification courses provide practical, industry-relevant knowledge backed by the credibility of UK-based accreditation.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex gap-4">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <h3 className="font-bold text-gray-900">Advance Your Career</h3>
                    <p className="text-gray-600">Whether you&apos;re looking to advance your career, pivot to a new field, or enhance your expertise, our programs deliver high-quality education.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl">🌍</div>
                  <div>
                    <h3 className="font-bold text-gray-900">Globally Recognized</h3>
                    <p className="text-gray-600">Gain access to qualifications recognized by employers and industries worldwide.</p>
                  </div>
                </div>
              </div>

              <Link
                href="#certifications"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold inline-block"
              >
                Explore Certifications
              </Link>
            </div>
            <div className="bg-linear-to-br from-blue-100 to-blue-50 p-12 rounded-xl">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">What We Offer</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700"><strong>Leadership & Management</strong> Certifications</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700"><strong>Project Management</strong> Qualifications</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700"><strong>Digital Skills & Technology</strong> Credentials</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700"><strong>Finance & Business Strategy</strong> Courses</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700">And much more!</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flexible Learning Options Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Flexible Learning Options
          </h2>
          <p className="text-center text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            We offer a diverse range of flexible learning options—Online, Hybrid, and Classroom—to suit your schedule and career goals.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Online */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-5xl mb-4">💻</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Online Courses</h3>
              <p className="text-gray-600 mb-4">
                Study at your own pace, from anywhere in the world, with engaging digital content and expert support at your fingertips. Perfect for those balancing busy schedules or seeking maximum flexibility.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Learn from anywhere</li>
                <li>✓ Self-paced learning</li>
                <li>✓ 24/7 access to materials</li>
                <li>✓ Expert support included</li>
              </ul>
            </div>

            {/* Hybrid */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition border-2 border-blue-600">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Hybrid Courses</h3>
              <p className="text-gray-600 mb-4">
                Combine the convenience of online learning with the value of in-person interaction. Participate in virtual sessions and attend select face-to-face workshops or seminars for a well-rounded experience.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Online + offline blend</li>
                <li>✓ Virtual sessions included</li>
                <li>✓ In-person workshops</li>
                <li>✓ Best of both worlds</li>
              </ul>
            </div>

            {/* Classroom */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-5xl mb-4">🏫</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Classroom Courses</h3>
              <p className="text-gray-600 mb-4">
                Immerse yourself in a traditional learning environment with hands-on instruction, peer collaboration, and direct access to our expert facilitators at locations across the UK.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Traditional classroom</li>
                <li>✓ Hands-on instruction</li>
                <li>✓ Peer collaboration</li>
                <li>✓ UK locations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Flexible Membership Plans
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-blue-600 mb-6">£0 <span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-600">Access to sample courses</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-600">Community forum access</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-600">Basic progress tracking</span>
                </li>
              </ul>
              <button className="w-full py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-blue-600 text-white p-8 rounded-lg shadow-lg scale-105 relative z-10">
              <div className="absolute top-0 right-0 bg-yellow-400 text-blue-600 px-4 py-1 rounded-bl-lg font-bold text-sm">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">£29 <span className="text-lg">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span>✓</span>
                  <span>All Free features</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Unlimited course access</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Certificate issuance</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span>
                  <span>1-on-1 mentor support</span>
                </li>
              </ul>
              <button className="w-full py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold">
                Subscribe Now
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-blue-600 mb-6">Custom <span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-600">All Pro features</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-600">Team management tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-600">Custom course creation</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-600">24/7 priority support</span>
                </li>
              </ul>
              <button className="w-full py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            What Our Learners Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Software Developer',
                text: 'Study Express UK transformed my career. I completed 5 courses and got promoted within 6 months!',
                avatar: '👩‍💼',
              },
              {
                name: 'Ahmed Hassan',
                role: 'Business Manager',
                text: 'The courses are practical and well-structured. The community is incredibly supportive.',
                avatar: '👨‍💼',
              },
              {
                name: 'Emma Wilson',
                role: 'Entrepreneur',
                text: 'I used Study Express UK to upskill my team. The results exceeded our expectations.',
                avatar: '👩‍🔬',
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">&quot;{testimonial.text}&quot;</p>
                <div className="mt-4 flex gap-1 text-yellow-400">★★★★★</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Transform Your Learning?</h2>
          <p className="text-lg text-blue-100">
            Join thousands of successful learners on Study Express UK. Start your journey today!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold text-lg"
            >
              Sign Up Free
            </Link>
            <Link
              href="/api/auth/signin"
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-blue-700 font-semibold text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-white font-bold mb-4">📚 Study Express UK</div>
              <p className="text-sm">Empowering learners worldwide with quality education.</p>
            </div>
            <div>
              <div className="text-white font-bold mb-4">Product</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Courses</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white">For Teams</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-white font-bold mb-4">Company</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-white font-bold mb-4">Legal</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms</Link></li>
                <li><Link href="#" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Study Express UK. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
