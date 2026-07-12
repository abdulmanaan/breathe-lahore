const BASE_URL = 'http://localhost:8000'

async function getJSON(path) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`API responded with ${res.status}`)
  return res.json()
}

export const fetchSummary = () => getJSON('/api/insights/summary')
export const fetchSafestHours = (days = 7) => getJSON(`/api/insights/safest-hours?days=${days}`)
export const fetchDailyTrend = (days = 14) => getJSON(`/api/insights/daily-trend?days=${days}`)
