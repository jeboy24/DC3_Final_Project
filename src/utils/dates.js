// Small date helpers. Dates are stored as "YYYY-MM-DD" strings, which compare correctly as text.
const pad = (n) => String(n).padStart(2, '0')

export function toStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
export const todayStr = () => toStr(new Date())

export function addDays(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return toStr(d)
}

// whole days from date a to date b (negative if b is earlier)
export function daysBetween(a, b) {
  return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000)
}

export function formatDate(s) {
  if (!s) return '—'
  return new Date(s + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}