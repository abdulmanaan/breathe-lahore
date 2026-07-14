function formatMeasuredAt(isoString) {
    const clock = new Date(isoString.replace(/(Z|[+-]\d{2}:?\d{2})$/, ''))
    const date = new Date(clock)
    return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    })
}

export default function CurrentSummary({ summary }) {
    const { us_aqi, pm2_5, pm10, category, change_24h, measured_at } = summary
    const improving = change_24h !== null && change_24h < 0

    return (
        <section className="grid gap-8 sm:grid-cols-[auto_1fr] sm:items-end">
        <div>
            <p className="font-mono text-xs uppercase tracking-widest text-fog">Live US AQI</p>
            <p
            className="font-mono text-[7rem] sm:text-[9rem] leading-none font-medium"
            style={{ color: category.color }}
            >
            {us_aqi}
            </p>
            <p className="font-display text-xl font-medium" style={{ color: category.color }}>
            {category.level}
            </p>
        </div>

        <div className="space-y-4 sm:pb-3">
            <p className="text-slate-300 max-w-md leading-relaxed">{category.advice}</p>

            <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm">
            <span className="text-fog">
                PM2.5 <span className="text-white">{pm2_5} µg/m³</span>
            </span>
            <span className="text-fog">
                PM10 <span className="text-white">{pm10} µg/m³</span>
            </span>
            {change_24h !== null && (
                <span className={improving ? 'text-emerald-400' : 'text-red-400'}>
                {improving ? '▼' : '▲'} {Math.abs(change_24h)} vs 24h ago
                </span>
            )}
            </div>

            <p className="font-mono text-xs text-fog">Measured {formatMeasuredAt(measured_at)}</p>
        </div>
        </section>
  )
}
