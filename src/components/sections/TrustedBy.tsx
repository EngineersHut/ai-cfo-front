"use client";

import { motion } from 'framer-motion'

const logos = ['LogoIpsum', 'LogoIpsum', 'LogoIpsum', 'LogoIpsum', 'LogoIpsum']

export default function TrustedBy() {
  return (
    <section className="py-14 border-y" style={{ borderColor: 'var(--border-rgba)', background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-sm font-medium mb-10" style={{ color: 'var(--text-muted)' }}>
          Trusted by <span className="font-bold" style={{ color: 'var(--text-primary)' }}>10,000+</span> founders & business owners
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-10">
          {logos.map((logo, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2 transition-opacity hover:opacity-70">
              <div className="w-6 h-6 rounded bg-gray-200" />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>{logo}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
