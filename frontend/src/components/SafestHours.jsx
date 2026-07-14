import { useEffect, useState } from 'react'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fetchSafestHours } from '../api'
import RangeSelector from './RangeSelector'

function hourLabel(hour) {
  if (hour === 0) return '12a'
  if (hour === 12) return '12p'
  return hour < 12 ? `${hour}a` : `${hour - 12}p`
}

function barColor(aqi) {
  if (aqi <= 50) return '#22c55e'
  if (aqi <= 100) return '#eab308'
  if (aqi <= 150) return '#f97316'
  if (aqi <= 200) return '#ef4444'
  if (aqi <= 300) return '#a855f7'
  return '#7f1d1d'
}

export default function SafestHours({ initialHours }) {
  const [days, setDays] = useState(7)
  const [hours, setHours] = useState(initialHours)

  useEffect(() => {
    fetchSafestHours(days)
      .then((data) => setHours(data.hours))
      .catch((err) => console.error('Safest hours fetch failed:', err))
  }, [days])

  if (!hours || hours.length === 0) return null
  const best = hours.reduce((a, b) => (a.avg_aqi <= b.avg_aqi ? a : b))

  return (
    <section className="border border-line bg-panel p-5 sm:p-6">
      <div className="flex items-center justify-between mb-1 gap-3">
        <h2 className="font-display font-medium text-white">Safest hours</h2>
        <RangeSelector value={days} onChange={setDays} />
      </div>
      <p className="font-mono text-sm text-emerald-400 mb-4">
        Cleanest air around {hourLabel(best.hour)} (avg AQI {best.avg_aqi})
      </p>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={hours} margin={{ top: 4, right: 0, left: -22, bottom: 0 }}>
          <XAxis
            dataKey="hour"
            tickFormatter={hourLabel}
            stroke="#8b95a7"
            fontSize={11}
            tickLine={false}
            interval={2}
          />
          <YAxis stroke="#8b95a7" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            contentStyle={{
              background: '#11151d',
              border: '1px solid #232a36',
              fontFamily: 'IBM Plex Mono',
              fontSize: 12,
            }}
            labelFormatter={(h) => `Hour: ${hourLabel(h)}`}
            formatter={(value) => [value, 'Avg AQI']}
          />
          <Bar dataKey="avg_aqi" radius={[2, 2, 0, 0]}>
            {hours.map((entry) => (
              <Cell key={entry.hour} fill={barColor(entry.avg_aqi)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  )
}
