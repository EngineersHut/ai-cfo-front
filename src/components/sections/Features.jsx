import { motion } from 'framer-motion'
import { Brain, TrendingUp, Bell, ShieldCheck, BarChart3, Zap } from 'lucide-react'

const features = [
  { icon: Brain,       title: 'AI Powered Insights',     desc: 'Automatically analyze your financial data and uncover trends, risks, and opportunities.', color: 'blue' },
  { icon: TrendingUp,  title: 'Financial Forecasting',    desc: 'Predict future revenue, profit, and cash flow with AI-driven projections.', color: 'indigo' },
  { icon: Bell,        title: 'Smart Alerts',             desc: 'Get notified instantly about risks, anomalies, and important financial changes.', color: 'violet' },
  { icon: ShieldCheck, title: 'Risk Detection',           desc: 'AI-powered risk engine continuously monitors and flags potential threats.', color: 'emerald' },
  { icon: BarChart3,   title: 'Real-Time Analytics',      desc: 'Live dashboards with drill-down across revenue, expenses, profit, and cash flow.', color: 'cyan' },
  { icon: Zap,         title: 'Instant Reports',          desc: 'Generate board-ready financial reports in seconds. Export to PDF or Excel.', color: 'amber' },
]

const colors = {
  blue:   { bg: 'bg-blue-100 dark:bg-blue-500/10',   icon: 'text-blue-600' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-500/10',icon: 'text-indigo-600' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-500/10',icon: 'text-violet-600' },
  emerald:{ bg: 'bg-emerald-100 dark:bg-emerald-500/10',icon:'text-emerald-600' },
  cyan:   { bg: 'bg-cyan-100 dark:bg-cyan-500/10',   icon: 'text-cyan-600' },
  amber:  { bg: 'bg-amber-100 dark:bg-amber-500/10', icon: 'text-amber-600' },
}

export default function Features() {
  return (
    <section id="features" className="py-28" style={{ background: 'var(--section-alt)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            Powerful Features for <span className="text-gradient">Smarter</span> Financial Decisions
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
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
                className="rounded-2xl p-7 card card-hover group">
                <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className={c.icon} />
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
