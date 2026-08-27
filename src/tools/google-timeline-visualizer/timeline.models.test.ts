import { describe, expect, test } from 'vitest'

import { calculateDistanceKm, filterPointsByDate, normalizeTimeline } from './timeline.models'

describe('timeline models', () => {
  test('normalizes current Timeline array entries in timestamp order', () => {
    const result = normalizeTimeline([
      { startTime: '2025-01-02T00:00:00Z', latLng: '37.5665,126.9780' },
      { startTime: '2025-01-01T00:00:00Z', latLng: '35.1796,129.0756' },
    ])

    expect(result).toEqual({
      points: [
        { latitude: 35.1796, longitude: 129.0756, timestamp: '2025-01-01T00:00:00.000Z' },
        { latitude: 37.5665, longitude: 126.978, timestamp: '2025-01-02T00:00:00.000Z' },
      ],
      error: undefined,
    })
  })

  test('reads route points from semanticSegments activity paths', () => {
    const result = normalizeTimeline({ semanticSegments: [{
      startTime: '2025-02-01T00:00:00Z',
      timelinePath: [{ point: '37.5,127.0', time: '2025-02-01T01:00:00Z' }],
    }] })

    expect(result.points).toHaveLength(1)
  })

  test('drops invalid and duplicate coordinates', () => {
    const result = normalizeTimeline([
      { startTime: '2025-01-01T00:00:00Z', latLng: '37.5,127.0' },
      { startTime: '2025-01-01T00:00:00Z', latLng: '37.5,127.0' },
      { startTime: 'not-a-date', latLng: '37.5,127.0' },
      { startTime: '2025-01-01T01:00:00Z', latLng: '-91,127.0' },
    ])

    expect(result.points).toEqual([{ latitude: 37.5, longitude: 127, timestamp: '2025-01-01T00:00:00.000Z' }])
  })

  test('returns unsupported-format for unknown JSON shapes', () => {
    expect(normalizeTimeline({ data: [] })).toEqual({ points: [], error: 'unsupported-format' })
  })

  test('filters inclusive local calendar dates', () => {
    const points = [{ latitude: 37.5, longitude: 127, timestamp: '2025-01-02T12:00:00.000Z' }]
    expect(filterPointsByDate(points, '2025-01-02', '2025-01-02')).toEqual(points)
  })

  test('calculates Haversine distance in kilometers', () => {
    expect(calculateDistanceKm([
      { latitude: 0, longitude: 0, timestamp: '2025-01-01T00:00:00.000Z' },
      { latitude: 0, longitude: 1, timestamp: '2025-01-01T01:00:00.000Z' },
    ])).toBeCloseTo(111.195, 3)
  })
})
