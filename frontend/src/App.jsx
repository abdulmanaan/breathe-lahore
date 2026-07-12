import { useEffect, useState } from 'react'

export default function App() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/insights/summary')
      .then((res) => res.json())
      .then(setSummary)
      .catch(() => setError('Could not reach the BreatheLahore API.'))
  }, [])

  if (error) return <p className="p-8 text-red-400">{error}</p>
  if (!summary) return <p className="p-8 text-slate-400">Loading…</p>

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
      <p className="text-slate-400 text-sm uppercase tracking-widest">Lahore Air Quality</p>
      <h1 className="text-7xl font-bold" style={{ color: summary.category.color }}>
        {summary.us_aqi}
      </h1>
      <p className="text-xl font-medium" style={{ color: summary.category.color }}>
        {summary.category.level}
      </p>
      <p className="max-w-md text-center text-slate-300">{summary.category.advice}</p>
    </div>
  )
}
