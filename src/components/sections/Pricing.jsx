import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Starter', icon: '🚀', monthlyPrice: 49.50, yearlyPrice: 39.50, popular: false,
    features: ['AI insights','Forecasting','Smart alerts','AI powered risk detection','Real time predictive analytics','Automated compliance monitoring','Intelligent fraud prevention','Adaptive cybersecurity protocols'],
    cta: 'Get Started',
  },
  {
    name: 'Professional', icon: '⚡', monthlyPrice: 99.99, yearlyPrice: 79.99, popular: true,
    badge: '1.2k users already use this',
    features: ['Advanced AI insights','Enhanced forecasting models','Custom smart alerts','Proactive risk detection','Deep real time analytics','Comprehensive compliance checks','Multi layer fraud prevention','Dynamic cybersecurity strategies'],
    cta: 'Get Started Free',
  },
  {
    name: 'Enterprise', icon: '🏢', monthlyPrice: 199.99, yearlyPrice: 159.99, popular: false,
    features: ['Enterprise grade AI insights','Predictive forecasting suite','Personalized smart alerts','AI driven risk management','Full spectrum predictive analytics','Automated regulatory compliance','Advanced fraud detection systems','Adaptive security infrastructure'],
    cta: 'Get Started',
  },
]

export default function Pricing() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" className="py-28" style={{ background: 'var(--section-alt)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>Pricing</h2>
          <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>Simple, powerful, and built for clarity</p>
          <div className="inline-flex items-center rounded-2xl p-1.5 gap-1 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            {['Monthly','Yearly'].map((t, i) => (
              <button key={t} onClick={() => setYearly(i === 1)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  yearly === (i === 1) ? 'bg-blue-600 text-white shadow-lg' : ''
                }`}
                style={yearly !== (i === 1) ? { color: 'var(--text-secondary)' } : {}}>
                {t}{i === 1 && <span className="ml-2 text-xs text-emerald-500 font-bold">-20%</span>}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div key={plan.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`rounded-2xl p-7 relative ${plan.popular ? 'scale-[1.04]' : 'card card-hover'}`}
              style={plan.popular ? { background: '#2563eb', border: '2px solid rgba(147,197,253,0.4)' } : {}}>
              {plan.popular && plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
                  ⭐ {plan.badge}
                </div>
              )}
              <p className="text-2xl mb-3">{plan.icon}</p>
              <h3 className={`text-xl font-bold mb-1 ${plan.popular ? 'text-white' : ''}`} style={!plan.popular ? { color: 'var(--text-primary)' } : {}}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-7">
                <span className={`text-3xl font-extrabold ${plan.popular ? 'text-white' : ''}`} style={!plan.popular ? { color: 'var(--text-primary)' } : {}}>
                  ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className={`text-sm ${plan.popular ? 'text-blue-100' : ''}`} style={!plan.popular ? { color: 'var(--text-muted)' } : {}}>/month</span>
              </div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${plan.popular ? 'text-blue-100' : 'text-blue-600'}`}>Features:</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map(feat => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.popular ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-500/15'}`}>
                      <Check size={11} className={plan.popular ? 'text-white' : 'text-blue-600'} />
                    </span>
                    <span className={`text-sm ${plan.popular ? 'text-blue-50' : ''}`} style={!plan.popular ? { color: 'var(--text-secondary)' } : {}}>{feat}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] ${
                plan.popular ? 'bg-white text-blue-700 hover:bg-blue-50' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
