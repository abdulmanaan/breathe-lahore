export default function Header() {
  return (
    <header className="flex items-baseline justify-between border-b border-line pb-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white">
          Breathe<span className="text-fog">Lahore</span>
        </h1>
        <p className="font-mono text-xs text-fog mt-1">31.55°N, 74.34°E — hourly readings</p>
      </div>
      <p className="hidden sm:block font-mono text-xs uppercase tracking-widest text-fog">
        Air Quality Intelligence
      </p>
    </header>
  )
}
