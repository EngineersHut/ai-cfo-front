import { motion } from 'framer-motion'

export default function CTABanner() {
  return (
    <section className="py-10 px-3">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-xl text-center"
          style={{ minHeight: 190 }}
        >
          {/* Flat Blue Base */}
          <div
            className="absolute inset-0"
            style={{
              background: '#2F67E8',
            }}
          />

          {/* Soft Vertical Stripes */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                rgba(255,255,255,0.06) 0px,
                rgba(255,255,255,0.06) 72px,
                transparent 72px,
                transparent 144px
              )`,
            }}
          />

          {/* Content */}
          <div className="relative flex flex-col items-center justify-center px-8 py-12">
            <h2 className="text-[34px] md:text-[42px] font-semibold text-white leading-tight mb-6">
              Start Making Smarter Financial
              <br />
              Decisions Today
            </h2>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center px-5 py-2.5 bg-white text-gray-800 text-sm font-medium rounded-lg shadow-sm hover:bg-blue-50 transition"
            >
              Get Started Free
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}