"use client";

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  { name: 'Marcus Thorne', title: 'CFO, Aether Logistics', initials: 'MT',
    quote: "Sovereign didn't just automate our reporting; it restructured how we think about risk. The predictive liquidity models have saved us millions in capital allocation errors." },
  { name: 'Sarah Chen', title: 'CEO, Nexus Ventures', initials: 'SC',
    quote: "Finally a financial tool that speaks my language. The AI insights caught a cash flow issue three months before it would have hit us. Absolutely game-changing." },
  { name: 'David Okafor', title: 'Founder, BrightScale', initials: 'DO',
    quote: "Setup took two minutes. Within the first week, the forecasting dashboard gave us clarity we'd never had before. Our investors love the board reports." },
]

export default function Testimonials() {
  return (
    <section className="py-28" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            Commanding <span className="text-gradient">Trust</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            See how visionary financial leaders are utilizing Sovereign to gain unprecedented control over their operations.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-7 card card-hover">
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => <Star key={j} size={14} className="text-amber-400" fill="#f59e0b" />)}
              </div>
              <p className="text-sm leading-relaxed mb-7 italic" style={{ color: 'var(--text-secondary)' }}>"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
