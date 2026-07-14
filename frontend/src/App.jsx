import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-white">
      <main className="mx-auto max-w-5xl px-5 py-8 sm:py-12 space-y-10">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <footer className="border-t border-line pt-5">
          <p className="font-mono text-xs text-fog">
            Data: Open-Meteo Air Quality API · Updated hourly
          </p>
        </footer>
      </main>
    </div>
  )
}
