"use client";

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import Image from 'next/image'

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
    <section className="py-28 bg-bg-alt">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-[32px] font-semibold leading-[40px] text-text-primary mb-4"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0%' }}>
            Commanding Trust
          </h2>
          <p className="text-[16px] font-normal leading-[24px] text-text-secondary max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0%' }}>
            See how visionary financial leaders are utilizing Sovereign to gain unprecedented control over their operations.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-bg-card rounded-2xl p-8 border border-border-subtle shadow-sm flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom duration-500"
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-[#0f172a] mb-4 flex items-center justify-center overflow-hidden border-2 border-border-subtle shadow-sm relative">
                <Image 
                  src="/client-portrait.png" 
                  alt={t.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* User Info */}
              <h4 className="text-[16px] font-bold text-text-primary mb-0.5" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                {t.name}
              </h4>
              <p className="text-[12px] text-text-muted mb-4" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                {t.title}
              </p>

              {/* Stars */}
              <div className="flex gap-1 mb-5 justify-center">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} className="text-[#f97316]" fill="#f97316" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[14px] leading-[22px] text-text-secondary font-normal" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                "{t.quote}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
