"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import TrustedBy from '@/components/sections/TrustedBy';
import ProblemSolution from '@/components/sections/ProblemSolution';
import Features from '@/components/sections/Features';
import PlatformShowcase from '@/components/sections/PlatformShowcase';
import Pricing from '@/components/sections/Pricing';
import CTABanner from '@/components/sections/CTABanner';
import Testimonials from '@/components/sections/Testimonials';

export default function LandingPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f8fa]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Suspense fallback={<div className="h-[72px]" />}>
        <Navbar />
      </Suspense>
      <main>
        <Hero />
        <TrustedBy />
        <ProblemSolution />
        <Features />
        <PlatformShowcase />
        <Pricing />
        <CTABanner />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
