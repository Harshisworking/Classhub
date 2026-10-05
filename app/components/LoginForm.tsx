'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Make sure this is imported

export function LoginForm() {
  const router = useRouter(); // Initialize router
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn('credentials', {
        redirect: false, 
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
      } else {
        // Fetch the fresh session to check if the user is an admin or student
        const res = await fetch('/api/auth/session');
        const session = await res.json();

        if (session?.user) {
          const isAdmin = session.user.isAdmin;

          // Explicitly push them to their designated route based on role
          if (isAdmin) {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
          router.refresh();
        } else {
          // Fallback if session is delayed
          router.push('/dashboard');
        }
      }
    } catch (err) {
      console.error('An error occurred', err);
      setError('A network error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // ... rest of your JSX form return

  return (
    <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-md">
      <h2 className="text-2xl font-bold text-white text-center mb-6">Log In</h2>
      
      {/* Show error message if login fails */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm text-center">
          {error}
        </div>
      )}

      <button type="button" className="w-full bg-white text-gray-900 font-bold py-2.5 px-4 rounded-lg border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors mb-6">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center mb-6">
        <div className="flex-1 border-t border-gray-600"></div>
        <span className="px-3 text-sm text-gray-400">Or log in with email</span>
        <div className="flex-1 border-t border-gray-600"></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">
            School Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-2.5 px-4 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="School Email Address"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-2.5 px-4 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Password"
            required
          />
        </div>

        <div className="flex justify-end mb-6">
          <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
            Forgot Password?
          </Link>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center ${
            isLoading ? 'bg-blue-600/50 text-white/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading ? 'Authenticating...' : 'Log In'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Don't have an account? <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold">Sign Up</Link>
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500">
        By logging in, you agree to our <Link href="/terms" className="underline hover:text-gray-300">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-gray-300">Privacy Policy</Link>.
      </div>
    </div>
  );
}