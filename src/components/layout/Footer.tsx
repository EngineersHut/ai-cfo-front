import Image from 'next/image'

const links = ['Blogs', 'Faq', 'Contact', 'Help Center', 'Privacy Policy', 'Terms of Service']

const TwitterIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
  </svg>
);

const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.24.73-.53v-1.84c-3.03.66-3.67-1.46-3.67-1.46-.5-1.26-1.2-1.6-1.2-1.6-1-.68.07-.66.07-.66 1.1.07 1.68 1.13 1.68 1.13.98 1.68 2.58 1.2 3.2 1 .1-.7.38-1.2.69-1.48-2.42-.28-4.97-1.21-4.97-5.38 0-1.2.43-2.16 1.13-2.92-.1-.27-.48-1.39.1-2.88 0 0 .92-.3 3 1.12a10.5 10.5 0 015.5 0c2.1-1.42 3-1.12 3-1.12.58 1.49.2 2.61.1 2.88.7.76 1.13 1.72 1.13 2.92 0 4.18-2.55 5.1-4.98 5.37.39.33.74.98.74 1.97v2.93c0 .3.18.63.74.53A11 11 0 0012 1.27" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="py-8 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Image
              src="/upscale.png"
              alt="North Quest Solutions Logo"
              width={160}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {links.map(l => (
              <a
                key={l}
                href="#"
                className="text-[16px] font-normal leading-[24px] text-slate-600 hover:text-blue-600 transition-colors"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {l}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-6 text-slate-900">
            <a href="#" className="hover:text-blue-600 transition-all hover:scale-110">
              <TwitterIcon size={20} />
            </a>
            <a href="#" className="hover:text-blue-600 transition-all hover:scale-110">
              <GithubIcon size={22} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className=" border-t border-slate-50">
          <p className="text-center text-[14px] text-slate-400 font-normal leading-[20px]"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
            © 2026 North Quest Solution. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
