import { useEffect, useState } from 'react'
import { fetchDailyTrend, fetchSafestHours, fetchSummary } from './api'
import Header from './components/Header'
import CurrentSummary from './components/CurrentSummary'
import SafestHours from './components/SafestHours'
import DailyTrend from './components/DailyTrend'

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([fetchSummary(), fetchSafestHours(), fetchDailyTrend()])
      .then(([summary, safestHours, dailyTrend]) =>
        setData({ summary, hours: safestHours.hours, trend: dailyTrend.trend })
      )
      .catch((err) => {
        console.error('Dashboard data fetch failed:', err)
        setError('Could not reach the BreatheLahore API. Is the backend running?')
        })
  }, [])

  return (
    <div className="min-h-screen bg-ink text-white">
      <main className="mx-auto max-w-5xl px-5 py-8 sm:py-12 space-y-10">
        <Header />

        {error && <p className="font-mono text-sm text-red-400">{error}</p>}
        {!error && !data && <p className="font-mono text-sm text-fog animate-pulse">Loading readings…</p>}

        {data && (
          <>
            <CurrentSummary summary={data.summary} />
            <div className="grid gap-6 lg:grid-cols-2">
              <SafestHours hours={data.hours} />
              <DailyTrend trend={data.trend} />
            </div>
          </>
        )}

        <footer className="border-t border-line pt-5">
          <p className="font-mono text-xs text-fog">
            Data: Open-Meteo Air Quality API · Updated hourly
          </p>
        </footer>
      </main>
    </div>
  )
}
