export interface TimelinePoint {
  latitude: number
  longitude: number
  timestamp: string
}

export interface TimelineParseResult {
  points: TimelinePoint[]
  error?: 'unsupported-format'
}

type TimelineEntry = { startTime?: unknown; latLng?: unknown }
type SemanticSegment = { timelinePath?: unknown }
type TimelinePathEntry = { point?: unknown; time?: unknown }

const decimalPattern = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/
const isoTimestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})$/

function parsePoint(coordinate: unknown, timestamp: unknown): TimelinePoint | undefined {
  if (typeof coordinate !== 'string' || typeof timestamp !== 'string') return undefined
  if (!isoTimestampPattern.test(timestamp)) return undefined

  const parsedTimestamp = new Date(timestamp)
  if (Number.isNaN(parsedTimestamp.getTime())) return undefined

  const tokens = coordinate.split(',').map(value => value.trim())
  if (tokens.length !== 2 || !tokens.every(value => decimalPattern.test(value))) return undefined
  const values = tokens.map(value => Number(value))

  const [latitude, longitude] = values
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return undefined

  return { latitude, longitude, timestamp: parsedTimestamp.toISOString() }
}

function uniqueSorted(points: TimelinePoint[]): TimelinePoint[] {
  const seen = new Set<string>()
  return points
    .filter((point) => {
      const key = `${point.timestamp}/${point.latitude}/${point.longitude}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}

export function normalizeTimeline(input: unknown): TimelineParseResult {
  let points: TimelinePoint[] | undefined

  if (Array.isArray(input)) {
    points = input.flatMap((entry: TimelineEntry) => {
      const point = parsePoint(entry?.latLng, entry?.startTime)
      return point ? [point] : []
    })
  } else if (input !== null && typeof input === 'object' && Array.isArray((input as { semanticSegments?: unknown }).semanticSegments)) {
    points = (input as { semanticSegments: SemanticSegment[] }).semanticSegments.flatMap(segment => {
      if (!Array.isArray(segment?.timelinePath)) return []
      return (segment.timelinePath as TimelinePathEntry[]).flatMap(pathEntry => {
        const point = parsePoint(pathEntry?.point, pathEntry?.time)
        return point ? [point] : []
      })
    })
  }

  if (!points) return { points: [], error: 'unsupported-format' }
  return { points: uniqueSorted(points), error: undefined }
}

function localCalendarDate(timestamp: string): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function filterPointsByDate(points: TimelinePoint[], startDate: string, endDate: string): TimelinePoint[] {
  return points.filter(({ timestamp }) => {
    const date = localCalendarDate(timestamp)
    return date >= startDate && date <= endDate
  })
}

export function calculateDistanceKm(points: TimelinePoint[]): number {
  if (points.length < 2) return 0

  const earthRadiusKm = 6371
  const degreesToRadians = (degrees: number) => degrees * Math.PI / 180
  let distance = 0

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1]
    const current = points[index]
    const latitudeDelta = degreesToRadians(current.latitude - previous.latitude)
    const longitudeDelta = degreesToRadians(current.longitude - previous.longitude)
    const latitude1 = degreesToRadians(previous.latitude)
    const latitude2 = degreesToRadians(current.latitude)
    const a = Math.sin(latitudeDelta / 2) ** 2
      + Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(longitudeDelta / 2) ** 2
    distance += earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  return distance
}
