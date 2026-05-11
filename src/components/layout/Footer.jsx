import { Twitter, Linkedin, Github } from 'lucide-react'
import Logo from '@/img/upscale.png'


const links = ['Blogs', 'FAQ', 'Contact', 'Help Center', 'Privacy Policy', 'Terms of Service']

export default function Footer() {
  return (
    <footer className="py-10 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center">
            <img
              src={Logo}
              alt="AI CFO Logo"
              className="h-8 w-auto object-contain"
            />
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {links.map(l => (
              <a key={l} href="#" onClick={e => e.preventDefault()} className="text-xs hover:text-blue-600 transition-colors" style={{ color: 'var(--text-muted)' }}>{l}</a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            {[Twitter, Linkedin, Github].map((Icon, i) => (
              <a key={i} href="#" onClick={e => e.preventDefault()} className="hover:text-blue-600 transition-colors" style={{ color: 'var(--text-muted)' }}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          © 2026 North Quest Solution. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
