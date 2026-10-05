'use client';

import React from 'react';
import { LandingHeader } from './components/LandingHeader';
import { HeroSection } from './components/HeroSection';
import { FeatureCard } from './components/FeatureCard';
import { SocialProof } from './components/SocialProof';
import { Footer } from './components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 font-sans">
      <LandingHeader />
      
      <main>
        <HeroSection />
        
        <section className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="📊" 
              title="Personal Dashboard" 
              description="Track Progress & Set Goals. View grade trends and completion stats." 
            />
            <FeatureCard 
              icon="⏱️" 
              title="Test Command Center" 
              description="See Upcoming Tests, Access Key Terms & Study Materials." 
            />
            <FeatureCard 
              icon="📋" 
              title="Material Hub" 
              description="Centralize Notes, Lab Procedures & Essay Prompts. Find files instantly." 
            />
          </div>
        </section>
        
        <SocialProof />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;