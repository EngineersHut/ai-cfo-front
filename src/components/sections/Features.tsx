"use client";

import { motion } from 'framer-motion'
import { Brain, TrendingUp, Bell, ShieldCheck, BarChart3, Zap } from 'lucide-react'

const features = [
  { icon: Brain,       title: 'AI Powered Insights',     desc: 'Automatically analyze your financial data and uncover trends, risks, and opportunities.', color: 'blue' as const },
  { icon: TrendingUp,  title: 'Financial Forecasting',    desc: 'Predict future revenue, profit, and cash flow with AI-driven projections.', color: 'indigo' as const },
  { icon: Bell,        title: 'Smart Alerts',             desc: 'Get notified instantly about risks, anomalies, and important financial changes.', color: 'violet' as const },
  { icon: ShieldCheck, title: 'Risk Detection',           desc: 'AI-powered risk engine continuously monitors and flags potential threats.', color: 'emerald' as const },
  { icon: BarChart3,   title: 'Real-Time Analytics',      desc: 'Live dashboards with drill-down across revenue, expenses, profit, and cash flow.', color: 'cyan' as const },
  { icon: Zap,         title: 'Instant Reports',          desc: 'Generate board-ready financial reports in seconds. Export to PDF or Excel.', color: 'amber' as const },
]

const colors = {
  blue:   { bg: 'bg-blue-100',   icon: 'text-blue-600' },
  indigo: { bg: 'bg-indigo-100', icon: 'text-indigo-600' },
  violet: { bg: 'bg-violet-100', icon: 'text-violet-600' },
  emerald:{ bg: 'bg-emerald-100', icon: 'text-emerald-600' },
  cyan:   { bg: 'bg-cyan-100',   icon: 'text-cyan-600' },
  amber:  { bg: 'bg-amber-100',  icon: 'text-amber-600' },
}

export default function Features() {
  return (
    <section id="features" className="py-28 bg-bg-alt">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-text-primary">
            Powerful Features for <span className="bg-gradient-to-br from-[#1d4ed8] via-[#3b82f6] to-[#6366f1] bg-clip-text text-transparent">Smarter</span> Financial Decisions
          </h2>
          <p className="text-lg max-w-xl mx-auto text-text-secondary">
            Everything you need to analyze, predict, and optimize your finances.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const c = colors[f.color]
            const Icon = f.icon
            return (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="rounded-2xl p-7 bg-[var(--bg-card)] border border-[var(--border-rgba)] shadow-[var(--card-shadow)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--card-hover)] hover:border-blue-400/30 group">
                <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className={c.icon} />
                </div>
                <h3 className="text-lg font-bold mb-3 text-text-primary">{f.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{f.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
