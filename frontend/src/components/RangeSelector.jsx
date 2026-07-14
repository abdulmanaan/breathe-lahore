const OPTIONS = [7, 14, 30]

export default function RangeSelector({ value, onChange }) {
  return (
    <div className="flex border border-line font-mono text-xs">
      {OPTIONS.map((days) => (
        <button
          key={days}
          onClick={() => onChange(days)}
          className={
            days === value
              ? 'px-3 py-1.5 bg-white text-ink font-medium'
              : 'px-3 py-1.5 text-fog hover:text-white transition-colors'
          }
        >
          {days}d
        </button>
      ))}
    </div>
  )
}
