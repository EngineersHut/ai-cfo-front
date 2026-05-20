"use client";

import { motion } from 'framer-motion'

import Image from 'next/image'

const logos = [
  '/LogoIpsum6.png',
  '/LogoIpsum1.png',
  '/LogoIpsum2.png',
  '/LogoIpsum3.png',
  '/LogoIpsum4.png',
  '/LogoIpsum5.png',
]

export default function TrustedBy() {
  return (
    <section className="py-12 border-y border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-[12px] font-medium mb-12 text-slate-400"
          style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0%' }}>
          Trusted by <span className="font-bold text-slate-900">10,000+</span> founders & business owners
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
          {logos.map((logo, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="flex items-center transition-opacity hover:opacity-100 opacity-80">
              <Image
                src={logo}
                alt={`Partner Logo ${i + 1}`}
                width={120}
                height={32}
                className="object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
