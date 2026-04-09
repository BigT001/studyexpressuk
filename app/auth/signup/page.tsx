'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'INDIVIDUAL',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.userType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || 'An error occurred. Please try again.');
        setIsLoading(false);
        return;
      }

      if (response.status === 201) {
        // Automatically sign in user and redirect based on role
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          // Determine redirect based on user role
          let redirectPath = '/individual';
          if (formData.userType === 'CORPORATE') {
            redirectPath = '/corporate';
          } else if (formData.userType === 'STAFF') {
            redirectPath = '/staff';
          }
          // Use replace to avoid going back to signup
          router.replace(redirectPath);
        } else {
          // If auto-signin fails, redirect to signin page
          router.push('/auth/signin?message=Account created successfully. Please sign in.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-[76px] flex flex-col">
      <div className="flex flex-1">
        {/* Left Panel - Branding/Marketing (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden items-center justify-center p-12">
          {/* Decorative Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-900/40 via-gray-900 to-gray-900"></div>
            <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent"></div>
            
            {/* subtle grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-12">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-xl">SE</span>
                </div>
                <span className="text-white text-2xl font-black tracking-tight">StudyExpress<span className="text-green-500">UK</span></span>
              </div>

              <h1 className="text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                Start your educational journey today.
              </h1>
              <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                Join thousands of ambitious learners and leading organizations who are transforming their future through our elite platform.
              </p>

              <div className="space-y-6">
                {[
                  { title: 'World-Class Courses', desc: 'Expert-led content designed for real-world impact.' },
                  { title: 'Interactive Learning', desc: 'Engaging masterclasses and live events.' },
                  { title: 'Recognized Certificates', desc: 'Earn credentials that accelerate your career.' }
                ].map((feature, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + (i * 0.1) }}
                    key={i} 
                    className="flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 xl:p-24 relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">SE</span>
              </div>
              <span className="text-gray-900 text-xl font-black tracking-tight">StudyExpress<span className="text-green-600">UK</span></span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-500 font-medium">Please fill in your details to get started.</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-50/50 border border-red-100 rounded-xl"
              >
                <p className="text-sm text-red-600 font-semibold mb-1">Signup Error</p>
                <p className="text-sm text-red-500">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange}
                      placeholder="Jane"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange}
                      placeholder="Doe"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="userType" className="block text-sm font-bold text-gray-700 mb-2">Account Type</label>
                <div className="relative">
                  {formData.userType === 'CORPORATE' ? (
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  ) : (
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  )}
                  <select
                    id="userType" name="userType" value={formData.userType} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="INDIVIDUAL">Individual Learner</option>
                    <option value="CORPORATE">Corporate Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="password" name="password" type="password" value={formData.password} onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium tracking-widest"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">Confirm Box</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium tracking-widest"
                      required
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 pt-2">
                <input type="checkbox" required className="w-5 h-5 rounded-md border-gray-300 text-green-600 focus:ring-green-500 mt-0.5 cursor-pointer" />
                <span className="text-sm text-gray-600 font-medium">
                  I agree to the{' '}
                  <Link href="/terms" className="text-gray-900 hover:text-green-600 underline decoration-gray-300 underline-offset-4 transition-colors">Terms</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-gray-900 hover:text-green-600 underline decoration-gray-300 underline-offset-4 transition-colors">Privacy Policy</Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="group w-full flex items-center justify-center gap-2 px-4 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-green-600 transition-all duration-300 disabled:opacity-50 disabled:hover:bg-gray-900 shadow-md hover:shadow-[0_8px_20px_rgba(34,197,94,0.3)] mt-4"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
                {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <p className="text-center text-gray-600 text-sm mt-10 font-medium">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-gray-900 font-bold hover:text-green-600 underline decoration-gray-300 underline-offset-4 transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
        </div>
      </div>
    </div>
  );
}
