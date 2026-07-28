import dayjs from 'dayjs'
import 'dayjs/locale/es.js'

export function formatLongDate(dateValue = new Date()) {
  return dayjs(dateValue).locale('es').format('D [de] MMMM [de] YYYY')
}
