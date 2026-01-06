import Link from 'next/link';
import { HeroSection } from '@/components/HeroSection';
import { ExploreAll } from '@/components/ExploreAll';
import { ExploreEvents } from '@/components/ExploreEvents';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Explore Events Section */}
      <ExploreEvents />

      {/* Explore All Section */}
      <ExploreAll />

      {/* Corporate Component */}


      {/* Get Certified Section - COMMENTED OUT FOR LATER */}
      {/* <section id="certified" className="py-20 bg-white">... Certifications Section ...</section> */}
      
      {/* Flexible Learning Options Section - COMMENTED OUT FOR LATER */}
      {/* <section className="bg-gray-50 py-20">... Learning Options ...</section> */}
      
      {/* Pricing Section - COMMENTED OUT FOR LATER */}
      {/* <section className="py-20">... Pricing Plans ...</section> */}
      
      {/* Testimonials Section - COMMENTED OUT FOR LATER */}
      {/* <section className="bg-gray-50 py-20">... Testimonials ...</section> */}

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
