import { useEffect, useState } from 'react'
import { fetchDailyTrend, fetchSafestHours, fetchSummary } from '../api'
import CurrentSummary from '../components/CurrentSummary'
import SafestHours from '../components/SafestHours'
import DailyTrend from '../components/DailyTrend'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([fetchSummary(), fetchSafestHours(), fetchDailyTrend()])
      .then(([summary, safestHours, dailyTrend]) =>
        setData({ summary, hours: safestHours.hours, trend: dailyTrend.trend })
      )
      .catch((err) => {
        console.error('Dashboard data fetch failed:', err)
        setError('Could not reach the BreatheLahore API.')
      })
  }, [])

  if (error) return <p className="font-mono text-sm text-red-400">{error}</p>
  if (!data) return <p className="font-mono text-sm text-fog animate-pulse">Loading readings…</p>

  return (
    <div className="space-y-10">
      <CurrentSummary summary={data.summary} />
      <div className="grid gap-6 lg:grid-cols-2">
        <SafestHours initialHours={data.hours} />
        <DailyTrend initialTrend={data.trend} />
      </div>
    </div>
  )
}
