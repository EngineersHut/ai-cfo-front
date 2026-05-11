"use client";

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

// ─── Input field ───────────────────────────────────────────────
interface InputFieldProps {
  label: string;
  icon: any;
  type?: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightEl?: React.ReactNode;
}

function InputField({ label, icon: Icon, type = 'text', placeholder, required, value, onChange, rightEl }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-text-primary">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
          <Icon size={16} />
        </span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pl-10 pr-10 py-3 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-bg-alt border-border-subtle text-text-primary"
        />
        {rightEl && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-text-muted">
            {rightEl}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Social button ─────────────────────────────────────────────
function SocialBtn({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button type="button"
      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all hover:border-blue-400 border-border-subtle bg-bg-alt text-text-primary">
      {icon}
      {label}
    </button>
  )
}

// ─── LOGIN form ────────────────────────────────────────────────
function LoginForm({ switchTo }: { switchTo: () => void }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      console.log('Login attempt:', { email, password });
      setTimeout(() => {
        setLoading(false);
        window.location.href = '/admin';
      }, 1000);
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <InputField label="Email" icon={Mail} type="email" placeholder="Ahmad.account@gmail.com"
        required value={email} onChange={e => setEmail(e.target.value)} />

      <InputField label="Password" icon={Lock} type={showPw ? 'text' : 'password'} placeholder="••••••••••"
        required value={password} onChange={e => setPassword(e.target.value)}
        rightEl={showPw
          ? <EyeOff size={16} onClick={() => setShowPw(false)} />
          : <Eye size={16} onClick={() => setShowPw(true)} />} />

      <button type="submit" disabled={loading}
        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-all hover:scale-[1.01] active:scale-100">
        {loading ? 'Signing in...' : 'Continue'}
      </button>

      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-xs text-text-muted">Or login with</span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      <div className="flex gap-3">
        <SocialBtn label="Google" icon={
          <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        } />
        <SocialBtn label="Apple" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
        } />
      </div>

      <p className="text-center text-sm text-text-muted">
        Don't have an account?{' '}
        <button type="button" onClick={switchTo} className="text-blue-600 font-semibold hover:underline">Register</button>
      </p>
    </form>
  )
}

// ─── REGISTER form ─────────────────────────────────────────────
function RegisterForm({ switchTo }: { switchTo: () => void }) {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [agreed, setAgreed]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) return setError('Passwords do not match')
    if (!agreed) return setError('Please agree to Terms of Service')
    setLoading(true); setError('')
    try {
      console.log('Register attempt:', { name, email, password });
      setTimeout(() => {
        setLoading(false);
        window.location.href = '/admin';
      }, 1000);
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <InputField label="Full Name" icon={User} placeholder="Ahmad Husein"
        required value={name} onChange={e => setName(e.target.value)} />

      <InputField label="Email" icon={Mail} type="email" placeholder="Ahmad.account@gmail.com"
        required value={email} onChange={e => setEmail(e.target.value)} />

      <InputField label="Password" icon={Lock} type={showPw ? 'text' : 'password'} placeholder="••••••••••"
        required value={password} onChange={e => setPassword(e.target.value)}
        rightEl={showPw ? <EyeOff size={16} onClick={() => setShowPw(false)} /> : <Eye size={16} onClick={() => setShowPw(true)} />} />

      <InputField label="Confirm Password" icon={Lock} type={showPw ? 'text' : 'password'} placeholder="••••••••••"
        required value={confirm} onChange={e => setConfirm(e.target.value)} />

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded accent-blue-600" />
        <span className="text-sm text-text-secondary">
          I agree to Ai-CFO{' '}
          <a href="#" className="text-blue-600 font-semibold hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-blue-600 font-semibold hover:underline">Privacy Policy</a>
        </span>
      </label>

      <button type="submit" disabled={loading}
        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-all hover:scale-[1.01] active:scale-100">
        {loading ? 'Creating account...' : 'Continue'}
      </button>

      <p className="text-center text-sm text-text-muted">
        Already have an account?{' '}
        <button type="button" onClick={switchTo} className="text-blue-600 font-semibold hover:underline">Login</button>
      </p>
    </form>
  )
}

// ─── MAIN MODAL ────────────────────────────────────────────────
export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: { isOpen: boolean; onClose: () => void; defaultMode?: 'login' | 'register' }) {
  const [mode, setMode] = useState(defaultMode)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl bg-bg-secondary border border-border-subtle"
            onClick={e => e.stopPropagation()}>

            {/* Close */}
            <button onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-text-muted">
              <X size={18} />
            </button>

            {/* Header */}
            <div className="text-center mb-7">
              <h2 className="text-2xl font-extrabold mb-1 text-text-primary">
                Welcome to <span className="bg-gradient-to-br from-[#1d4ed8] via-[#3b82f6] to-[#6366f1] bg-clip-text text-transparent">Ai-CFO</span>
              </h2>
              <p className="text-sm text-text-muted">
                {mode === 'login' ? 'Enter your email and password to Login' : 'Create your free account'}
              </p>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.div key={mode}
                initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                transition={{ duration: 0.2 }}>
                {mode === 'login'
                  ? <LoginForm switchTo={() => setMode('register')} />
                  : <RegisterForm switchTo={() => setMode('login')} />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
