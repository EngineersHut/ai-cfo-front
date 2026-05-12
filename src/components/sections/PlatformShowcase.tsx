"use client";

import { motion } from 'framer-motion'
import { LayoutDashboard, Users, Settings, Shield, FolderSync, ClipboardList } from 'lucide-react'
import Image from 'next/image';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: Users, label: 'Organizations' },
  { icon: Users, label: 'Users' },
  { icon: Settings, label: 'Configuration' },
  { icon: Shield, label: 'Authentication' },
  { icon: FolderSync, label: 'Directory Sync' },
  { icon: ClipboardList, label: 'Audit Logs' },
  { icon: Shield, label: 'Permissions & Roles' },
]

const activityLog = [
  { text: 'A new SSO connection was added by Ahmad', tag: '#GoogleSSO', time: '13 Jun 2025, 10:12', color: 'blue' as const },
  { text: 'Fatima invited a new team member', tag: '#Admin', time: '12 Jun 2025, 13:01', color: 'violet' as const },
  { text: 'Directory sync with Azure failed', tag: '#ConnectionTimeout', time: '11 Jun 2025, 12:09', color: 'red' as const },
  { text: 'Ahmad created a new organization "DevSync Labs"', tag: '#Org', time: '11 Jun 2025, 09:33', color: 'emerald' as const },
]

const tagColor = {
  blue: 'bg-blue-100   text-blue-600',
  violet: 'bg-violet-100 text-violet-600',
  red: 'bg-red-100    text-red-600',
  emerald: 'bg-emerald-100 text-emerald-600',
}

export default function PlatformShowcase() {
  return (
    <section id="ai-cfo" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center ">
          <h2 className="text-[32px] font-semibold leading-[40px] mb-4 text-[#0f172a]"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0%' }}>
            See Your Financial Data Come to Life
          </h2>
          <p className="text-[16px] font-normal leading-[24px] max-w-xl mx-auto text-slate-500"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0%' }}>
            Simple, powerful, and built for clarity
          </p>
        </motion.div>



        <div className="h-[800px] w-[1300px]">
          <img
            src="/images/Dashboard.png"
            alt="Dashboard"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </section>
  )
}
