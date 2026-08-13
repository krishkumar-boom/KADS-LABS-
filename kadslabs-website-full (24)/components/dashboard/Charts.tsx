"use client"

interface LineChartProps {
  data: number[]
  height?: number
  stroke?: string
  fill?: string
  label?: string
  valueFormatter?: (v: number) => string
}

export function LineChart({ data, height = 80, stroke = "#1E6BFF", fill = "rgba(30,107,255,0.15)", label, valueFormatter }: LineChartProps) {
  if (!data?.length) return null
  const w = 300
  const h = height
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const step = w / (data.length - 1 || 1)
  const points = data.map((v, i) => {
    const x = i * step
    const y = h - ((v - min) / range) * (h - 8) - 4
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(" ")
  const areaPath = `M 0,${h} L ${points} L ${w},${h} Z`
  const linePath = `M ${points.split(" ").join(" L ")}`
  const last = data[data.length - 1]

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        <defs>
          <linearGradient id={`g-${stroke.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={fill} />
        <path d={linePath} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={w} cy={h - ((last - min) / range) * (h - 8) - 4} r="3" fill={stroke} />
      </svg>
      {label && (
        <div className="mt-2 flex items-center justify-between text-[10px]" style={{ color: "var(--text-muted)" }}>
          <span>{label}</span>
          <span className="font-semibold" style={{ color: stroke }}>{valueFormatter ? valueFormatter(last) : last}</span>
        </div>
      )}
    </div>
  )
}

interface BarChartProps {
  data: { label: string; value: number; color?: string }[]
  height?: number
}

export function BarChart({ data, height = 120 }: BarChartProps) {
  if (!data?.length) return null
  const max = Math.max(...data.map(d => d.value)) || 1
  const barWidth = 100 / data.length
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => {
        const h = (d.value / max) * (height - 24)
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
            <div className="w-full rounded-t-md transition-all duration-700"
                 style={{ height: h, background: `linear-gradient(180deg, ${d.color || "#1E6BFF"}, ${d.color || "#1E6BFF"}80)` }} />
            <span className="text-[9px] truncate w-full text-center" style={{ color: "var(--text-subtle)" }}>{d.label}</span>
          </div>
        )
      })}
    </div>
  )
}

interface DonutProps {
  segments: { label: string; value: number; color: string }[]
  size?: number
}

export function DonutChart({ segments, size = 140 }: DonutProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1
  const radius = size / 2 - 12
  const circumference = 2 * Math.PI * radius
  let offset = 0
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--bg-tertiary)" strokeWidth="12" />
        {segments.map((seg, i) => {
          const len = (seg.value / total) * circumference
          const dash = `${len} ${circumference - len}`
          const el = (
            <circle key={i} cx={size/2} cy={size/2} r={radius} fill="none"
                    stroke={seg.color} strokeWidth="12" strokeDasharray={dash}
                    strokeDashoffset={-offset} strokeLinecap="round" />
          )
          offset += len
          return el
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{total}</div>
        <div className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-subtle)" }}>Total</div>
      </div>
    </div>
  )
}
