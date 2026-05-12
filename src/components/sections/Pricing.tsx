"use client";

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles, User, Building2 } from 'lucide-react'

const plans = [
  {
    name: 'Starter', icon: '🚀', monthlyPrice: 49.50, yearlyPrice: 39.50, popular: false,
    features: ['AI insights', 'Forecasting', 'Smart alerts', 'AI powered risk detection', 'Real time predictive analytics', 'Automated compliance monitoring', 'Intelligent fraud prevention', 'Adaptive cybersecurity protocols'],
    cta: 'Get Started',
  },
  {
    name: 'Professional', icon: '⚡', monthlyPrice: 99.99, yearlyPrice: 79.99, popular: true,
    badge: '1.2k users already use this',
    features: ['Advanced AI insights', 'Enhanced forecasting models', 'Custom smart alerts', 'Proactive risk detection', 'Deep real time analytics', 'Comprehensive compliance checks', 'Multi layer fraud prevention', 'Dynamic cybersecurity strategies'],
    cta: 'Get Started Free',
  },
  {
    name: 'Enterprise', icon: '🏢', monthlyPrice: 199.99, yearlyPrice: 159.99, popular: false,
    features: ['Enterprise grade AI insights', 'Predictive forecasting suite', 'Personalized smart alerts', 'AI driven risk management', 'Full spectrum predictive analytics', 'Automated regulatory compliance', 'Advanced fraud detection systems', 'Adaptive security infrastructure'],
    cta: 'Get Started',
  },
]

export default function Pricing() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" className="py-20 bg-bg-alt">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-4">
          <h2 className="text-[32px] font-semibold leading-[40px] mb-4 text-[#0f172a]"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0%' }}>
            Pricing
          </h2>
          <p className="text-[16px] font-normal leading-[24px] max-w-xl mx-auto text-slate-500"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0%' }}>
            Simple, powerful, and built for clarity
          </p>
          <div className="flex items-center justify-center pt-8 gap-4 ">
            <span className={`text-sm font-medium transition-colors ${!yearly ? 'text-[#0f172a]' : 'text-slate-400'}`}
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Monthly</span>

            <button
              onClick={() => setYearly(!yearly)}
              className="relative w-[44px] h-[24px] rounded-full bg-[#dbeafe] transition-colors focus:outline-none"
            >
              <motion.div
                animate={{ x: yearly ? 22 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-[#2563eb] shadow-sm"
              />
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium transition-colors ${yearly ? 'text-[#0f172a]' : 'text-slate-400'}`}
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Yearly</span>

            </div>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center gap-8 items-end max-w-[1200px] mx-auto">
          {plans.map((plan, i) => (
            <motion.div key={plan.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative bg-white rounded-[16px] flex flex-col transition-all duration-300 w-full md:w-[384px] overflow-hidden ${plan.popular
                ? 'border-[4px] border-[#2563eb] shadow-xl h-[588px] z-10'
                : 'border border-slate-100 shadow-sm hover:shadow-md h-[546px]'
                }`}
            >
              {plan.popular && (
                <div className="bg-[#2563eb] text-white px-6 py-3 flex justify-between items-center text-[12px] font-semibold">
                  <span>Most Popular</span>
                  <span className="opacity-90">{plan.badge}</span>
                </div>
              )}

              <div className="p-6 flex flex-col h-full">
                {/* Icon Container */}
                <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center mb-3">
                  {plan.name === 'Starter' && <Sparkles size={20} className="text-[#2563eb]" />}
                  {plan.name === 'Professional' && <User size={20} className="text-[#2563eb]" />}
                  {plan.name === 'Enterprise' && <Building2 size={20} className="text-[#2563eb]" />}
                </div>

                <h3 className="text-[18px] font-normal leading-[24px] text-[#2563eb] mb-0.5" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                  {plan.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-[24px] font-medium leading-[32px] text-[#0f172a]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                    ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-[14px] text-slate-400">/month</span>
                </div>

                <div className="w-full h-[1px] bg-slate-100 mb-4" />

                <p className="text-[14px] font-medium leading-[20px] text-slate-400 mb-3" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Features:</p>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map(feat => (
                    <li key={feat} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#2563eb] flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} className="text-white" />
                      </div>
                      <span className="text-[14px] font-normal leading-[20px] text-slate-600" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex justify-center">
                  <button className={`w-[336px] h-[40px] px-[16px] py-[10px] rounded-[10px] font-medium text-[14px] leading-[20px] transition-all flex items-center justify-center ${plan.popular
                    ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-200'
                    : 'bg-[#e0ebff] text-[#2563eb] hover:bg-[#d1e3ff]'
                    }`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                    {plan.cta}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
