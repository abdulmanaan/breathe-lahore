import { NavLink } from 'react-router-dom'

export default function Header() {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'font-mono text-xs uppercase tracking-widest text-white border-b border-white pb-1'
      : 'font-mono text-xs uppercase tracking-widest text-fog hover:text-white transition-colors pb-1'

  return (
    <header className="flex items-baseline justify-between border-b border-line pb-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white">
          Breathe<span className="text-fog">Lahore</span>
        </h1>
        <p className="font-mono text-xs text-fog mt-1">31.55°N, 74.34°E</p>
      </div>
      <nav className="flex gap-6">
        <NavLink to="/" end className={linkClass}>Home</NavLink>
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
      </nav>
    </header>
  )
}
