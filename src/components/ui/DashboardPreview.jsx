import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { m: 'Jan', v: 28 }, { m: 'Feb', v: 32 }, { m: 'Mar', v: 27 },
  { m: 'Apr', v: 38 }, { m: 'May', v: 35 }, { m: 'Jun', v: 42 },
  { m: 'Jul', v: 48 }, { m: 'Aug', v: 44 }, { m: 'Sep', v: 52 },
  { m: 'Oct', v: 58 }, { m: 'Nov', v: 54 }, { m: 'Dec', v: 62 },
]

export default function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-blue-500/10 blur-3xl rounded-3xl dark:bg-blue-600/20" />
      <div className="relative rounded-2xl p-5 shadow-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', maxWidth: 480 }}>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Revenue', value: '$128,400', change: '+12.5%', up: true },
            { label: 'Profit',  value: '$32,800',  change: '+8.2%',  up: true },
            { label: 'Expenses',value: '$95,600',  change: '-3.1%',  up: false },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 border" style={{ background: 'var(--section-alt)', borderColor: 'var(--border)' }}>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
              <div className={`flex items-center gap-1 mt-1 ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {s.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                <span className="text-xs font-semibold">{s.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="rounded-xl p-3 mb-4 border" style={{ background: 'var(--section-alt)', borderColor: 'var(--border)' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Revenue Trend</p>
          <ResponsiveContainer width="100%" height={90}>
            <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}k`} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} fill="url(#rev)" dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Cash Burn Rate', value: '-$10,400/mo', color: 'text-red-500' },
            { label: 'Cash Runway',    value: '10 Months',   color: 'text-amber-500' },
            { label: 'Cash in Hand',   value: '$95,600',     color: 'text-emerald-600' },
          ].map(i => (
            <div key={i.label} className="rounded-xl p-3 border" style={{ background: 'var(--section-alt)', borderColor: 'var(--border)' }}>
              <p className="text-[10px] mb-1 leading-tight" style={{ color: 'var(--text-muted)' }}>{i.label}</p>
              <p className={`text-xs font-bold ${i.color}`}>{i.value}</p>
            </div>
          ))}
        </div>

        {/* AI Insight */}
        <div className="flex items-start gap-3 glass-blue rounded-xl p-3">
          <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-600/20 flex items-center justify-center shrink-0">
            <AlertCircle size={12} className="text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] text-blue-600 font-bold mb-0.5">AI Insight</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Revenue increased 12% over the last 3 months driven by higher client retention.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
