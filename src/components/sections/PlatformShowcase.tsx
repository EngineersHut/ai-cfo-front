"use client";

import { motion } from 'framer-motion'
import { LayoutDashboard, Users, Settings, Shield, FolderSync, ClipboardList } from 'lucide-react'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: Users,           label: 'Organizations' },
  { icon: Users,           label: 'Users' },
  { icon: Settings,        label: 'Configuration' },
  { icon: Shield,          label: 'Authentication' },
  { icon: FolderSync,      label: 'Directory Sync' },
  { icon: ClipboardList,   label: 'Audit Logs' },
  { icon: Shield,          label: 'Permissions & Roles' },
]

const activityLog = [
  { text: 'A new SSO connection was added by Ahmad', tag: '#GoogleSSO', time: '13 Jun 2025, 10:12', color: 'blue' as const },
  { text: 'Fatima invited a new team member', tag: '#Admin', time: '12 Jun 2025, 13:01', color: 'violet' as const },
  { text: 'Directory sync with Azure failed', tag: '#ConnectionTimeout', time: '11 Jun 2025, 12:09', color: 'red' as const },
  { text: 'Ahmad created a new organization "DevSync Labs"', tag: '#Org', time: '11 Jun 2025, 09:33', color: 'emerald' as const },
]

const tagColor = {
  blue:   'bg-blue-100   text-blue-600',
  violet: 'bg-violet-100 text-violet-600',
  red:    'bg-red-100    text-red-600',
  emerald:'bg-emerald-100 text-emerald-600',
}

export default function PlatformShowcase() {
  return (
    <section id="ai-cfo" className="py-28 bg-[#e8eef8]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-text-primary">
            See Your Financial Data <span className="bg-gradient-to-br from-[#1d4ed8] via-[#3b82f6] to-[#6366f1] bg-clip-text text-transparent">Come to Life</span>
          </h2>
          <p className="text-lg text-text-secondary">Simple, powerful, and built for clarity</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl overflow-hidden shadow-2xl border bg-bg-card border-border-subtle">

          {/* Title bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border-subtle bg-bg-alt">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <div className="flex-1 ml-4 flex justify-center">
              <div className="w-48 h-5 rounded-lg bg-border-subtle" />
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-52 border-r p-4 hidden lg:block border-border-subtle bg-bg-alt">
              <div className="flex items-center gap-2 mb-6 px-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">N</div>
                <span className="text-xs font-semibold text-text-secondary">NQS</span>
              </div>
              <p className="text-[10px] uppercase tracking-wider px-2 mb-3 text-text-muted">Main</p>
              {sidebarItems.map(item => {
                const Icon = item.icon
                return (
                  <div key={item.label}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 cursor-pointer transition-colors ${
                      item.active ? 'bg-blue-600/15 text-blue-600' : 'text-text-muted hover:text-blue-600 hover:bg-blue-50'
                    }`}>
                    <Icon size={13} />
                    <span className="text-[11px] font-medium">{item.label}</span>
                  </div>
                )
              })}
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-text-primary">Welcome back, Ahmad 👋</h3>
                  <p className="text-xs mt-0.5 text-text-muted">Ready to manage your integrations?</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-600 text-xs font-semibold rounded-xl border border-blue-200 hover:bg-blue-600/20 transition-colors">
                  Export
                </button>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {['Invite a New User','Configure SSO Provider','Connect Directory','Create Organization'].map(qa => (
                  <div key={qa} className="rounded-xl p-3 border cursor-pointer hover:border-blue-300 transition-colors bg-bg-alt border-border-subtle">
                    <p className="text-[11px] font-semibold text-text-primary">{qa}</p>
                  </div>
                ))}
              </div>

              {/* Stats + Activity */}
              <div className="grid lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2 space-y-3">
                  {[
                    { label: 'Total Users', value: '282', change: '+4.5%', color: 'text-emerald-500' },
                    { label: 'Active Connections', value: '34', change: '+1.5%', color: 'text-blue-500' },
                    { label: 'Directories Connected', value: '21', change: '+1.2%', color: 'text-violet-500' },
                    { label: 'Events Tracked', value: '6,541', change: '+1.5%', color: 'text-cyan-500' },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between rounded-xl px-4 py-3 border bg-bg-alt border-border-subtle">
                      <span className="text-xs text-text-secondary">{stat.label}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-text-primary">{stat.value}</span>
                        <span className={`text-[10px] ml-2 ${stat.color}`}>{stat.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-3 space-y-2">
                  <p className="text-xs font-medium mb-3 text-text-muted">Audit Logs</p>
                  {activityLog.map((log, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl px-4 py-3 border bg-bg-alt border-border-subtle">
                      <div className="flex-1">
                        <p className="text-[11px] leading-snug text-text-secondary">{log.text}</p>
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full mt-1.5 inline-block ${tagColor[log.color].split(' dark:')[0]}`}>{log.tag}</span>
                      </div>
                      <p className="text-[10px] whitespace-nowrap text-text-muted">{log.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
