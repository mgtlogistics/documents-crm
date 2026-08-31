import dayjs from 'dayjs'

// Formatea una fecha en formato largo en español (ej. "14 de noviembre de 2024").
export default function formatLongDate(date, fallback = 'No llenado') {
  if (!date) return fallback

  const parsed = dayjs(date)
  if (!parsed.isValid()) return fallback

  return parsed.toDate().toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
