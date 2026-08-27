import { describe, expect, test } from 'vitest';

import {
  calculateDistanceKm,
  filterPointsByDate,
  normalizeTimeline,
  projectTimelinePoints,
} from './timeline.models';

describe('timeline models', () => {
  test('normalizes nested activity endpoints and visit candidates from a direct segment array', () => {
    const result = normalizeTimeline([
      {
        startTime: '2042-04-02T10:00:00Z',
        endTime: '2042-04-02T10:30:00Z',
        activity: {
          start: { latLng: 'geo:12.25°, 34.5°' },
          end: { latLng: { latLng: '12.75,35' } },
        },
      },
      {
        startTime: '2042-04-01T08:00:00+02:00',
        endTime: '2042-04-01T09:00:00+02:00',
        visit: {
          topCandidate: {
            placeLocation: { latLng: 'geo:-8.25°,42.75°' },
          },
        },
      },
    ]);

    expect(result).toEqual({
      points: [
        { latitude: -8.25, longitude: 42.75, timestamp: '2042-04-01T06:00:00.000Z' },
        { latitude: 12.25, longitude: 34.5, timestamp: '2042-04-02T10:00:00.000Z' },
        { latitude: 12.75, longitude: 35, timestamp: '2042-04-02T10:30:00.000Z' },
      ],
      error: undefined,
    });
  });

  test('normalizes absolute and offset timeline path times from semantic segments', () => {
    const result = normalizeTimeline({
      semanticSegments: [{
        startTime: '2043-05-06T01:00:00Z',
        timelinePath: [
          { point: 'geo:1.25,2.5', time: '2043-05-06T01:05:00Z' },
          { point: { latLng: '1.5°,2.75°' }, durationMinutesOffsetFromStartTime: '15' },
        ],
      }],
    });

    expect(result.points).toEqual([
      { latitude: 1.25, longitude: 2.5, timestamp: '2043-05-06T01:05:00.000Z' },
      { latitude: 1.5, longitude: 2.75, timestamp: '2043-05-06T01:15:00.000Z' },
    ]);
  });

  test('uses the shared segment extractor for semantic activity and visit records', () => {
    const result = normalizeTimeline({
      semanticSegments: [
        {
          startTime: '2044-06-01T00:00:00Z',
          endTime: '2044-06-01T00:20:00Z',
          activity: {
            start: { latLng: '3,4' },
            end: { latLng: '3.5,4.5' },
          },
        },
        {
          startTime: '2044-06-02T00:00:00Z',
          visit: {
            topCandidate: {
              placeLocation: { latLng: '5,6' },
            },
          },
        },
      ],
    });

    expect(result.points).toEqual([
      { latitude: 3, longitude: 4, timestamp: '2044-06-01T00:00:00.000Z' },
      { latitude: 3.5, longitude: 4.5, timestamp: '2044-06-01T00:20:00.000Z' },
      { latitude: 5, longitude: 6, timestamp: '2044-06-02T00:00:00.000Z' },
    ]);
  });

  test('keeps compatible flat points while dropping invalid and duplicate records', () => {
    const result = normalizeTimeline([
      { startTime: '2045-01-01T00:00:00Z', latLng: '-12.5,47' },
      { startTime: '2045-01-01T00:00:00Z', latLng: '-12.5,47' },
      { startTime: 'not-a-date', latLng: '-12.5,47' },
      { startTime: '2045-01-01T01:00:00Z', latLng: '-91,47' },
      { startTime: '2045-01-01T01:00:00Z', latLng: ',' },
    ]);

    expect(result.points).toEqual([
      { latitude: -12.5, longitude: 47, timestamp: '2045-01-01T00:00:00.000Z' },
    ]);
  });

  test('rejects non-ISO timestamps and invalid path offsets', () => {
    const result = normalizeTimeline([
      { startTime: '01/02/2046', latLng: '7,8' },
      {
        startTime: '2046-01-02T00:00:00Z',
        endTime: '2046-01-02T01:00:00Z',
        timelinePath: [
          { point: '7,8', durationMinutesOffsetFromStartTime: '-1' },
          { point: '7,8', durationMinutesOffsetFromStartTime: 'later' },
          { point: '7,8', durationMinutesOffsetFromStartTime: '1e300' },
          { point: '7,8', durationMinutesOffsetFromStartTime: ' ' },
          { point: '7,8', durationMinutesOffsetFromStartTime: '0x10' },
          { point: '7,8', durationMinutesOffsetFromStartTime: '1e1' },
          { point: '7,8', durationMinutesOffsetFromStartTime: '120' },
        ],
      },
    ]);

    expect(result.points).toEqual([]);
  });

  test('keeps lexical decimal offset minutes within the segment interval', () => {
    const result = normalizeTimeline([{
      startTime: '2046-01-02T00:00:00Z',
      endTime: '2046-01-02T01:00:00Z',
      timelinePath: [
        { point: '7,8', durationMinutesOffsetFromStartTime: '0.5' },
        { point: '7.5,8.5', durationMinutesOffsetFromStartTime: 60 },
      ],
    }]);

    expect(result.points).toEqual([
      { latitude: 7, longitude: 8, timestamp: '2046-01-02T00:00:30.000Z' },
      { latitude: 7.5, longitude: 8.5, timestamp: '2046-01-02T01:00:00.000Z' },
    ]);
  });

  test('returns unsupported-format for unknown JSON shapes', () => {
    expect(normalizeTimeline({ data: [] })).toEqual({ points: [], error: 'unsupported-format' });
  });

  test('filters inclusive local calendar dates', () => {
    const points = [{ latitude: 9, longitude: 10, timestamp: '2047-01-02T12:00:00.000Z' }];

    expect(filterPointsByDate(points, '2047-01-02', '2047-01-02')).toEqual(points);
  });

  test('calculates Haversine distance in kilometers', () => {
    expect(calculateDistanceKm([
      { latitude: 0, longitude: 0, timestamp: '2048-01-01T00:00:00.000Z' },
      { latitude: 0, longitude: 1, timestamp: '2048-01-01T01:00:00.000Z' },
    ])).toBeCloseTo(111.195, 3);
  });

  test('projects a single point to the canvas center for a visible marker', () => {
    expect(projectTimelinePoints(
      [{ latitude: 11, longitude: 22, timestamp: '2049-01-01T00:00:00.000Z' }],
      640,
      256,
    )).toEqual([{ x: 320, y: 128 }]);
  });

  test('bounds projection work for a large synthetic route', () => {
    const points = Array.from({ length: 150_000 }, (_, index) => ({
      latitude: -20 + (index % 40_000) / 1_000,
      longitude: -80 + (index % 120_000) / 1_000,
      timestamp: '2050-01-01T00:00:00.000Z',
    }));

    const coordinates = projectTimelinePoints(points, 640, 256);

    expect(coordinates.length).toBeLessThanOrEqual(2_000);
    expect(coordinates[0]).toEqual({ x: 24, y: 232 });
    expect(coordinates.at(-1)?.x).toBeTypeOf('number');
    expect(coordinates.every(({ x, y }) => Number.isFinite(x) && Number.isFinite(y))).toBe(true);
  });
});
