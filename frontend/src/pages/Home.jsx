import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchSummary } from '../api'

const STEPS = [
  {
    title: 'Collect',
    text: 'Every hour, the system pulls fresh pollution measurements for Lahore from the Open-Meteo Air Quality API.',
  },
  {
    title: 'Store',
    text: 'Each reading is saved to a PostgreSQL database, building a growing historical record of the city\'s air.',
  },
  {
    title: 'Analyze',
    text: 'The dashboard turns that history into answers: how bad is it right now, when is the air cleanest, and is it getting better or worse.',
  },
]

export default function Home() {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    fetchSummary().then(setSummary).catch(() => {})
  }, [])

  return (
    <div className="space-y-14">
      <section className="space-y-5 pt-4">
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
          Lahore's air, measured every hour.
        </h2>
        <p className="text-slate-300 leading-relaxed max-w-xl">
          Lahore regularly ranks among the most polluted cities in the world, yet most
          of us only ever see a single number in a news headline. BreatheLahore records
          the city's air quality around the clock and turns that data into practical
          answers: is it safe to go for a walk right now, and if not, when will it be?
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <Link
            to="/dashboard"
            className="font-mono text-sm bg-white text-ink px-5 py-2.5 font-medium hover:bg-slate-200 transition-colors"
          >
            Open the dashboard
          </Link>
          {summary && (
            <p className="font-mono text-sm text-fog">
              Right now:{' '}
              <span className="font-medium" style={{ color: summary.category.color }}>
                AQI {summary.us_aqi} · {summary.category.level}
              </span>
            </p>
          )}
        </div>
      </section>

      <section className="grid gap-px bg-line border border-line sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <div key={step.title} className="bg-panel p-5">
            <p className="font-mono text-xs text-fog mb-2">0{i + 1}</p>
            <h3 className="font-display font-medium text-white mb-2">{step.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{step.text}</p>
          </div>
        ))}
      </section>

      <section className="max-w-xl space-y-3">
        <h3 className="font-display text-lg font-medium text-white">What do the numbers mean?</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          The dashboard uses the US Air Quality Index (AQI), a scale from 0 to 500.
          Think of it as a thermometer for the air: below 50 is clean, above 150 means
          everyone should limit time outdoors, and above 300 is a health emergency.
          Every reading on the dashboard is color-coded, so you can judge the situation
          at a glance without memorizing anything.
        </p>
      </section>
    </div>
  )
}
