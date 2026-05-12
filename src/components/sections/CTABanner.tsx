"use client";

import { motion } from 'framer-motion'

export default function CTABanner() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[20px] text-center h-[400px] flex flex-col items-center justify-center bg-[#2563eb]"
        >
          {/* Subtle stripe pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                rgba(255,255,255,0.8) 0px,
                rgba(255,255,255,0.8) 72px,
                transparent 72px,
                transparent 144px
              )`,
            }}
          />

          {/* Content Container */}
          <div className="relative z-10 flex flex-col items-center gap-[40px] px-[80px] py-[100px]">
            <h2 className="text-[48px] font-semibold text-white leading-[60px] max-w-4xl text-center"
              style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0%' }}>
              Start Making Smarter Financial Decisions Today
            </h2>

            <button className="w-[144px] h-[40px] px-[16px] py-[10px] bg-white text-[#0f172a] text-[14px] font-medium leading-[20px] rounded-[10px] shadow-lg hover:bg-blue-50 transition-all flex items-center justify-center"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
              Get Started Free
            </button>
          </div>
          
          {/* Decorative glows */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 blur-[120px] opacity-20 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-300 blur-[120px] opacity-20 translate-x-1/2 translate-y-1/2" />
        </motion.div>
      </div>
    </section>
  )
}
