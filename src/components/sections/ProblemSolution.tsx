"use client";

import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import Image from 'next/image'

const problems = [
  'Manual data entry takes hours',
  'No real insights or forecasts',
  'Difficult to track financial trends',
  'High risk of human error',
]
const solutions = [
  'Automatic financial analysis',
  'Real-time insights & forecasts',
  'Clear trend visualization',
  'AI-powered risk detection',
]

export default function ProblemSolution() {
  return (
    <section id="about" className="py-28 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="text-[32px] font-semibold leading-[40px] mb-4 text-[#0f172a]"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0%' }}>
            Our Next Gen AI Solve Finance<br className="hidden sm:block" /> Problem
          </h2>
          <p className="text-[16px] font-normal leading-[24px] max-w-xl mx-auto text-slate-500"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0%' }}>
            Everything you need to analyze, predict, and optimize your finances.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Problem Card */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ height: 260, padding: 30, borderRadius: 16 }}
            className="bg-[#f8fafc] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[12px] font-normal leading-[16px] text-slate-400 mb-2"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}>The Problem</p>
              <h3 className="text-[20px] font-medium leading-[28px] text-[#0f172a] mb-6"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Spreadsheets are slowing you down</h3>
            </div>
            <ul className="space-y-3">
              {problems.map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#ef4444] flex items-center justify-center shrink-0">
                    <X size={12} className="text-white" />
                  </span>
                  <span className="text-[14px] leading-[20px] text-slate-500 font-normal"
                    style={{ fontFamily: 'var(--font-inter), sans-serif' }}>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Solution Card */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ height: 260, padding: 30, borderRadius: 16 }}
            className="relative overflow-hidden bg-[#2563eb] shadow-xl shadow-blue-100 flex flex-col justify-between">
            {/* Background Image */}
            <div className="absolute -right-6 -bottom-6 opacity-20 rotate-12 select-none pointer-events-none">
              <Image 
                src="/images/Mask group.png" 
                alt="Background Decoration"
                width={180}
                height={180}
                className="object-contain"
              />
            </div>
            
            <div>
              <p className="text-[12px] font-normal leading-[16px] text-blue-100 mb-2"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}>The Solution</p>
              <h3 className="text-[20px] font-medium leading-[28px] text-white mb-4"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}>AI CFO gives you clarity instantly</h3>
              <div className="w-full h-[1px] bg-white/20 mb-0" />
            </div>

            <ul className="space-y-3 relative z-10">
              {solutions.map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                    <Check size={12} className="text-[#2563eb]" />
                  </span>
                  <span className="text-[14px] leading-[20px] text-white font-normal"
                    style={{ fontFamily: 'var(--font-inter), sans-serif' }}>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
