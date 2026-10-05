'use client';

import React from 'react';
import { LandingHeader } from '../components/LandingHeader'; // adjust paths as needed
import { Footer } from '../components/Footer';
import { LoginForm } from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 font-sans">
      <LandingHeader />
      
      <main className="flex-1 flex items-center justify-center py-16 px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center w-full gap-16">
          
          {/* Left side: Welcome Text */}
          <div className="flex-1">
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
              Welcome Back to ClassHub
            </h1>
            <p className="text-xl text-gray-300">
              Log in to continue your academic journey with ClassHub.<br />
              Perfect for students and educators.
            </p>
          </div>
          
          {/* Right side: Login Form & Trust Badges */}
          <div className="flex-1 flex flex-col items-center lg:items-end w-full max-w-md">
            <LoginForm />
            
            <div className="mt-8 text-center w-full">
              <div className="flex justify-center gap-4 mb-3">
                {/* Placeholder Trust Badges */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] text-gray-500 shadow-md">
                    Logo {i}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Trusted by students at leading institutions.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}