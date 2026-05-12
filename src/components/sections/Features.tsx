"use client";

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Target, MoveRight, Shield } from 'lucide-react'

const features = [
  {
    title: 'AI-Powered Insights',
    desc: 'Automatically analyze your financial data and uncover trends, risks, and opportunities.',
    render: () => (
      <div
        style={{ width: 344, height: 294, borderRadius: 12 }}
        className="bg-white shadow-sm border border-slate-100 p-6 flex flex-col scale-[0.75] sm:scale-[0.85] origin-center">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
            <span className="text-[12px]">✨</span>
          </div>
          <span className="text-[13px] font-bold text-slate-700" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>AI Insights</span>
        </div>
        <div className="space-y-6 flex-1 flex flex-col justify-center">
          {[
            { label: 'Bank statements', pct: '40%', color: '#3b82f6', bg: '#eff6ff' },
            { label: 'Income statements', pct: '40%', color: '#f59e0b', bg: '#fffbeb' },
            { label: 'Tax Document', pct: '10%', color: '#10b981', bg: '#f0fdf4' },
          ].map((item, i) => (
            <div key={i} className="pl-4 border-l-[3px]" style={{ borderColor: item.color }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded" style={{ color: item.color, background: item.bg, fontFamily: 'var(--font-inter), sans-serif' }}>
                  {item.label} ({item.pct})
                </span>
              </div>
              <p className="text-[10.28px] leading-[14.69px] text-slate-500 font-normal"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                Revenue growth driven by increased customer retention and reduced churn in the enterprise segment.
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    title: 'Financial Forecasting',
    desc: 'Predict future revenue, profit, and cash flow with AI-driven projections.',
    render: () => (
      <div
        style={{ width: 298, height: 124.74, borderRadius: 8.56, padding: 11.41 }}
        className="bg-[#2563eb] text-white shadow-lg flex flex-col justify-between scale-90 sm:scale-100 relative">
        <div className="flex justify-between items-start">
          <span className="text-[14px] font-medium opacity-100" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Forecast vs Reality</span>
          <div className="opacity-60">
            <Target size={20} strokeWidth={1.5} />
          </div>
        </div>

        <div style={{ gap: 6 }} className="flex flex-col mb-1">
          <div className="flex justify-between text-[10px] opacity-80" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
            <span>Market Penetration Goal</span>
            <span>40% achieved</span>
          </div>
          <div className="w-full h-[6px] bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white w-[40%] rounded-full" />
          </div>
        </div>

        <div className="flex justify-between items-end pt-1">
          <div>
            <p className="text-[9px] opacity-70 uppercase tracking-wider mb-0.5" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>CURRENT PROGRESS</p>
            <p className="text-[16px] font-semibold" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Achieved 2% of 5% target</p>
          </div>
          <div className="w-[34px] h-[26px] rounded-[6px] bg-white/20 flex items-center justify-center">
            <MoveRight size={16} className="text-white" />
          </div>
        </div>
      </div>
    )
  },
  {
    title: 'Smart Alerts',
    desc: 'Get notified instantly about risks, anomalies, and important financial changes.',
    render: () => (
      <div
        style={{ width: 311, height: 210, borderRadius: 12, padding: 16 }}
        className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col scale-90 sm:scale-[0.95] origin-center">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-[36px] h-[36px] rounded-[10px] bg-[#eff6ff] flex items-center justify-center">
            <Shield size={18} strokeWidth={1.5} className="text-[#2563eb]" />
          </div>
          <span className="text-[14px] font-bold text-[#1e3a8a]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Cost Optimization Opportunities</span>
        </div>
        <div className="space-y-4 px-1 flex-1 flex flex-col justify-center">
          {[
            { dot: '#f59e0b', text: 'Transportation costs increased by 12% this quarter — renegotiate vendor contracts.' },
            { dot: '#f59e0b', text: 'Subscription costs are 18% above industry average — audit unused SaaS licenses.' },
            { dot: '#10b981', text: 'Fixed cost ratio is stable, indicating good overhead discipline.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-[6px] h-[6px] rounded-full mt-[5px] shrink-0" style={{ background: item.dot }} />
              <p className="text-[11.5px] leading-[17.25px] text-[#334155] font-normal" style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0px' }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="text-[32px] font-semibold leading-[40px] mb-4 text-[#0f172a]"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0%' }}>
            Powerful Features for Smarter<br />Financial Decisions
          </h2>
          <p className="text-[16px] font-normal leading-[24px] max-w-xl mx-auto text-slate-500"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0%' }}>
            Everything you need to analyze, predict, and optimize your finances.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{ width: 384, height: 460, borderRadius: 16, padding: 20 }}
              className="flex flex-col group border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
              {/* Graphic Header */}
              <div className="h-[320px] rounded-[12px] bg-[#eff6ff] border border-blue-50 mb-6 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:-translate-y-1">
                {f.render()}
              </div>
              {/* Text Footer */}
              <h3 className="text-[18px] font-normal leading-[24px] text-[#0f172a] mb-2 px-1"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}>{f.title}</h3>
              <p className="text-[14px] font-normal leading-[20px] text-slate-500 px-1"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
