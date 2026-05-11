"use client";

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import AuthModal from '@/components/ui/AuthModal'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
  { label: 'Industries', href: '#industries' },
  { label: 'AI CFO', href: '#ai-cfo' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openAuth = (mode: 'login' | 'register') => { setAuthMode(mode); setAuthOpen(true) }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border-rgba)' : 'none',
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3 shadow-sm' : 'py-5'}`}>

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/upscale.png"
              alt="AI CFO Logo"
              width={120}
              height={40}
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a key={link.label} href={link.href}
                className="px-4 py-2 text-sm rounded-lg transition-all font-medium hover:text-blue-600 text-text-secondary">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => openAuth('login')}
              className="px-4 py-2 text-sm font-medium transition-colors hover:text-blue-600 text-text-secondary">
              Login
            </button>
            <button onClick={() => openAuth('register')}
              className="px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-100">
              Get Started Free
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button className="p-2 text-text-secondary" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ background: 'var(--nav-bg)', borderTop: '1px solid var(--border-rgba)' }}
              className="md:hidden px-6 py-4">
              <nav className="flex flex-col gap-1 mb-4">
                {navLinks.map(link => (
                  <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-sm rounded-lg hover:text-blue-600 text-text-secondary">
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="flex flex-col gap-2">
                <button onClick={() => { openAuth('login'); setMobileOpen(false) }}
                  className="px-4 py-3 text-sm font-medium rounded-xl border text-text-primary border-border-subtle">
                  Login
                </button>
                <button onClick={() => { openAuth('register'); setMobileOpen(false) }}
                  className="px-4 py-3 text-sm font-semibold bg-blue-600 text-white rounded-xl">
                  Get Started Free
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} defaultMode={authMode} />
    </>
  )
}
