import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import TrustedBy from '@/components/sections/TrustedBy'
import ProblemSolution from '@/components/sections/ProblemSolution'
import Features from '@/components/sections/Features'
import PlatformShowcase from '@/components/sections/PlatformShowcase'
import Pricing from '@/components/sections/Pricing'
import CTABanner from '@/components/sections/CTABanner'
import Testimonials from '@/components/sections/Testimonials'

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <ProblemSolution />
        <Features />
        <PlatformShowcase />
        <Pricing />
        <CTABanner />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
