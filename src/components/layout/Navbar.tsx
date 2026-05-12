"use client";

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import AuthModal from '@/components/ui/AuthModal'
import ForgotPasswordModal from '@/components/ui/ForgotPasswordModal'
import WorkspaceModal from '@/components/ui/WorkspaceModal'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
  { label: 'Industries', href: '#industries' },
  { label: 'AI CFO', href: '#ai-cfo' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
]

function ModalHandler() {
  return (
    <>
      <AuthModal />
      <ForgotPasswordModal />
      <WorkspaceModal />
    </>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openModal = (mode: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('modal', mode)
    router.push(`?${params.toString()}`)
  }

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-[100] flex justify-center pt-6 px-4 pointer-events-none">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between px-[15px] py-[15px] rounded-[16px] transition-all duration-500 border w-full max-w-[1200px] h-[72px] pointer-events-auto bg-white/80 backdrop-blur-md shadow-md border-slate-100/50"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#0f172a] rounded-lg flex items-center justify-center text-white font-bold text-xl">
              N
            </div>
            <div className="hidden lg:flex flex-col leading-none">
              <span className="text-[14px] font-bold text-[#0f172a]">North Quest</span>
              <span className="text-[10px] text-slate-500">Solutions</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a key={link.label} href={link.href}
                className="px-4 py-2 text-[14px] font-medium transition-all hover:text-blue-600 text-slate-600"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => openModal('login')}
              className="px-6 py-2 text-[14px] font-medium leading-[20px] border border-slate-200 rounded-[12px] hover:bg-slate-50 transition-colors text-slate-700"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Login
            </button>
            <button
              onClick={() => openModal('register')}
              className="px-6 py-2 text-[14px] font-medium leading-[20px] bg-[#2563eb] text-white rounded-[12px] transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center">
            <button className="p-2 text-slate-600" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </motion.div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-full mt-4 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-[24px] border border-slate-200 shadow-2xl overflow-hidden md:hidden pointer-events-auto"
            >
              <div className="px-6 py-6 flex flex-col gap-2">
                {navLinks.map(link => (
                  <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-[14px] font-medium rounded-xl hover:bg-slate-50 text-slate-700">
                    {link.label}
                  </a>
                ))}
                <div className="h-[1px] bg-slate-100 my-2" />
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { openModal('login'); setMobileOpen(false) }}
                    className="py-3 text-sm font-medium rounded-xl border border-slate-200 text-slate-700">
                    Login
                  </button>
                  <button onClick={() => { openModal('register'); setMobileOpen(false) }}
                    className="py-3 text-sm font-semibold bg-[#2563eb] text-white rounded-xl">
                    Sign Up
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Wrap modals in Suspense to fix "not working" issue in Next.js */}
      <Suspense fallback={null}>
        <ModalHandler />
      </Suspense>
    </>
  )
}
