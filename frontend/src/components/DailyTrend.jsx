import { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { fetchDailyTrend } from '../api'
import RangeSelector from './RangeSelector'

function dayLabel(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function DailyTrend({ initialTrend }) {
  const [days, setDays] = useState(14)
  const [trend, setTrend] = useState(initialTrend)

  useEffect(() => {
    fetchDailyTrend(days)
      .then((data) => setTrend(data.trend))
      .catch((err) => console.error('Trend fetch failed:', err))
  }, [days])

  return (
    <section className="border border-line bg-panel p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2 className="font-display font-medium text-white">Daily trend</h2>
        <RangeSelector value={days} onChange={setDays} />
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={trend} margin={{ top: 4, right: 0, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="avgFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#232a36" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={dayLabel}
            stroke="#8b95a7"
            fontSize={11}
            tickLine={false}
          />
          <YAxis stroke="#8b95a7" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: '#11151d',
              border: '1px solid #232a36',
              fontFamily: 'IBM Plex Mono',
              fontSize: 12,
            }}
            labelFormatter={dayLabel}
          />
          <Area
            type="monotone"
            dataKey="worst_aqi"
            name="Worst"
            stroke="#ef4444"
            strokeWidth={1}
            strokeDasharray="4 4"
            fill="none"
          />
          <Area
            type="monotone"
            dataKey="avg_aqi"
            name="Average"
            stroke="#38bdf8"
            strokeWidth={2}
            fill="url(#avgFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  )
}
