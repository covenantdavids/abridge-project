import React, { useEffect, useState } from 'react'

const COLOR = '#4045a4'
const FILL = 'rgba(64,69,164,.15)'
const DAYS = 30 // how many days the graph shows

function dayKey(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function label(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

function addDays(d, n) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
}

// since: the date the user registered (ISO string, e.g. user.created_at)
// data:  customers per day, like { '2026-10-08': 3 } (empty until customer tracking is connected)
export default function CustomersChart({ since, data = {} }) {
  const [now, setNow] = useState(new Date())

  // Move on to the next day by itself.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  let reg = since ? new Date(since) : today
  if (isNaN(reg.getTime())) reg = today
  reg = new Date(reg.getFullYear(), reg.getMonth(), reg.getDate())
  if (reg > today) reg = today

  // The graph starts on the registration day and counts up.
  // After 30 days it keeps moving so today is always the last day shown.
  let first = reg
  if (today > addDays(reg, DAYS - 1)) first = addDays(today, -(DAYS - 1))

  const days = []
  for (let i = 0; i < DAYS; i++) {
    const d = addDays(first, i)
    days.push({ date: d, n: Number(data[dayKey(d)] || 0) })
  }

  const maxVal = Math.max(1, ...days.map(x => x.n))
  const yTop = Math.max(100, Math.ceil(maxVal / 100) * 100)
  const stepY = yTop / 5
  const ticks = [0, 1, 2, 3, 4, 5].map(i => i * stepY)

  const W = 640
  const left = 50
  const plotTop = 20
  const base = 250
  const H = base + 104
  const step = (W - left - 14 - 18) / (DAYS - 1)
  const xOf = i => left + 14 + i * step
  const yOf = v => base - (v / yTop) * (base - plotTop)

  const points = days.map((x, i) => `${xOf(i)},${yOf(x.n)}`).join(' ')
  const area = `${xOf(0)},${base} ${points} ${xOf(DAYS - 1)},${base}`

  return <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: 12, padding: '22px 14px 12px', marginTop: 28 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#6b7280', fontSize: 15 }}>
      <span style={{ width: 54, height: 18, background: '#e0e3f8', border: `3px solid ${COLOR}`, boxSizing: 'border-box', display: 'inline-block' }} />
      # Customers
    </div>
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Customers per day, from ${label(days[0].date)} to ${label(days[DAYS - 1].date)}`} style={{ width: '100%', height: 'auto', display: 'block', marginTop: 8 }}>
      {ticks.map(v => <text key={v} x={left - 10} y={yOf(v) + 5} fontSize="14" textAnchor="end" fill="#6b7280">{v}</text>)}
      <polygon points={area} fill={FILL} />
      <polyline points={points} fill="none" stroke={COLOR} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {days.map((x, i) => <circle key={i} cx={xOf(i)} cy={yOf(x.n)} r="4.5" fill="#fff" stroke={COLOR} strokeWidth="2.5"><title>{label(x.date)}: {x.n} customers</title></circle>)}
      {days.map((x, i) => i % 2 === 0 && <text key={'l' + i} transform={`translate(${xOf(i) + 4},${base + 14}) rotate(-90)`} textAnchor="end" fontSize="11.5" fill="#6b7280">{label(x.date)}</text>)}
    </svg>
  </div>
}