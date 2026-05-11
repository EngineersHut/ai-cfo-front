import { motion } from 'framer-motion'
import { Play, ArrowRight } from 'lucide-react'
import DashboardPreview from '../ui/DashboardPreview'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero() {
  return (
    <section className="relative min-h-screen hero-bg grid-overlay flex items-center pt-24 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <motion.div {...fadeUp(0.1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-blue text-blue-600 dark:text-blue-400 text-sm font-semibold mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-slow" />
              AI CFO • Financial Intelligence
            </motion.div>

            <motion.h1 {...fadeUp(0.2)}
              className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6"
              style={{ color: 'var(--text-primary)' }}>
              Your{' '}
              <span className="text-gradient">AI-Powered</span>
              <br />
              Financial Intelligence
              <br />
              Platform
            </motion.h1>

            <motion.p {...fadeUp(0.3)}
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: 'var(--text-secondary)' }}>
              Upload financial reports. Get instant insights, risks, and forecasts.
            </motion.p>

            <motion.div {...fadeUp(0.4)} className="flex flex-wrap items-center gap-4 mb-8">
              <a href="#" onClick={e => e.preventDefault()}
                className="group inline-flex items-center gap-2 px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-100">
                Get Started Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#" onClick={e => e.preventDefault()}
                className="group inline-flex items-center gap-3 px-6 py-4 rounded-2xl border font-semibold transition-all hover:border-blue-400"
                style={{ color: 'var(--text-primary)', borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
                <span className="w-9 h-9 rounded-full bg-blue-600/10 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                  <Play size={14} className="text-blue-600 ml-0.5" fill="#2563eb" />
                </span>
                View Demo
              </a>
            </motion.div>

            <motion.p {...fadeUp(0.5)} className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No credit card required • Setup in 2 minutes
            </motion.p>
          </div>

          {/* Right — dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="animate-float hidden lg:block">
            <DashboardPreview />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
