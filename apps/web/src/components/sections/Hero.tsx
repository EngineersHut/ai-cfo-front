"use client";

import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import DashboardPreview from '../ui/DashboardPreview';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export default function Hero() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const openRegister = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('modal', 'register');
    router.push(`?${params.toString()}`);
  };



  return (
    <section className="relative min-h-screen flex items-center pt-48 pb-16 overflow-hidden bg-gradient-to-r from-[#E5F0FF] to-[#EFF6FF] dark:from-[#0b0f19] dark:to-[#111827]">
      <div className="max-w-[1200px] mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-[1fr_1.4fr] items-center gap-12 lg:gap-20">
          {/* Left */}
          <div className="text-center lg:text-left">
            <motion.div {...fadeUp(0.1)}
              className="inline-flex items-center gap-2 px-0 py-2 text-blue-600 font-normal text-[12px] leading-[16px]"
              style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0%' }}>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-slow" />
              AI CFO • Financial Intelligence
            </motion.div>

            <motion.h1 {...fadeUp(0.2)}
              className="text-[32px] sm:text-[48px] font-semibold leading-[42px] sm:leading-[60px] text-text-primary"
              style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.02em' }}>
              Your AI-Powered <br className="hidden sm:block" />
              Financial Intelligence Platform
            </motion.h1>

            <motion.p {...fadeUp(0.3)}
              className="mt-6 text-[16px] sm:text-[18px] leading-[24px] sm:leading-[28px] text-text-secondary max-w-xl mx-auto lg:mx-0">
              Master your finances with AI-driven insights, real-time tracking,
              and predictive forecasting built for modern businesses.
            </motion.p>

            <motion.div {...fadeUp(0.4)}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-[12px] pt-7 mb-3">
              <button
                onClick={openRegister}
                className="inline-flex items-center justify-center w-[136px] h-[36px] bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-[14px] leading-[20px] rounded-[8px] border border-[#2563eb] transition-all shadow-sm active:scale-95 gap-[6px] px-[12px] py-[4px]"
                style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0%' }}>
                Get Started Free
              </button>
              <a href="#" onClick={e => e.preventDefault()}
                className="inline-flex items-center justify-center w-[138px] h-[36px] border border-border-subtle dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-text-primary dark:text-slate-100 font-medium text-[14px] leading-[20px] rounded-[10px] transition-all active:scale-95 gap-[10px]">
                View Demo
                <svg width="12" height="12" viewBox="0 0 24 24" className="shrink-0">
                  <path d="M5 3l14 9-14 9V3z" fill="currentColor" />
                </svg>
              </a>
            </motion.div>

            <motion.p {...fadeUp(0.5)}
              className="text-[12px] leading-[16px] text-text-muted"
              style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0%' }}>
              No credit card required • Setup in 2 minutes
            </motion.p>
          </div>

          {/* Right — dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="animate-float mt-16 lg:mt-0">
            <DashboardPreview />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
