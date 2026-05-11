import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'

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
    <section id="about" className="py-28" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <p className="text-blue-600 text-sm font-bold tracking-wider uppercase mb-4">Our Next Gen AI</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            Solve Finance <span className="text-gradient">Problem</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Everything you need to analyze, predict, and optimize your finances.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl p-8 card card-hover">
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>The Problem</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Spreadsheets are slowing you down</p>
            <ul className="space-y-4">
              {problems.map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-500/15 border border-red-200 dark:border-red-500/30 flex items-center justify-center shrink-0">
                    <X size={12} className="text-red-500" />
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-2xl p-8 card-hover relative overflow-hidden bg-blue-600">
            <div className="absolute right-4 top-2 text-[120px] font-black text-white/10 leading-none select-none">N</div>
            <h3 className="text-xl font-bold text-white mb-2">The Solution</h3>
            <p className="text-sm text-blue-100 mb-6">AI CFO gives you clarity instantly</p>
            <ul className="space-y-4">
              {solutions.map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-white" />
                  </span>
                  <span className="text-sm text-blue-50">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
