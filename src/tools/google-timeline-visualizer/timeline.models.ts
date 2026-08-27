export interface TimelinePoint {
  latitude: number
  longitude: number
  timestamp: string
}

export interface TimelineParseResult {
  points: TimelinePoint[]
  error?: 'unsupported-format'
}

export interface PreviewCoordinate {
  x: number
  y: number
}

type UnknownRecord = Record<string, unknown>;

const decimalPattern = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/;
const isoTimestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})$/;
const maxPreviewPoints = 2_000;

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function parseTimestamp(value: unknown): string | undefined {
  if (typeof value !== 'string' || !isoTimestampPattern.test(value)) {
    return undefined;
  }

  const timestamp = new Date(value);
  return Number.isNaN(timestamp.getTime()) ? undefined : timestamp.toISOString();
}

function parsePathTimestamp(pathEntry: UnknownRecord, segmentStartTime: unknown): string | undefined {
  const absoluteTimestamp = parseTimestamp(pathEntry.time);
  if (absoluteTimestamp) {
    return absoluteTimestamp;
  }

  const offset = pathEntry.durationMinutesOffsetFromStartTime;
  if ((typeof offset !== 'number' && typeof offset !== 'string') || offset === '') {
    return undefined;
  }

  const offsetMinutes = Number(offset);
  const startTimestamp = parseTimestamp(segmentStartTime);
  if (!startTimestamp || !Number.isFinite(offsetMinutes) || offsetMinutes < 0) {
    return undefined;
  }

  const timestamp = new Date(new Date(startTimestamp).getTime() + offsetMinutes * 60_000);
  return Number.isNaN(timestamp.getTime()) ? undefined : timestamp.toISOString();
}

function unwrapCoordinate(value: unknown): unknown {
  let current = value;
  for (let depth = 0; depth < 3 && isRecord(current) && 'latLng' in current; depth += 1) {
    current = current.latLng;
  }
  return current;
}

function parseCoordinate(value: unknown): Pick<TimelinePoint, 'latitude' | 'longitude'> | undefined {
  const coordinate = unwrapCoordinate(value);
  if (typeof coordinate !== 'string') {
    return undefined;
  }

  const tokens = coordinate
    .replace(/^geo:\s*/i, '')
    .split(',')
    .map(token => token.trim().replace(/\u00B0$/u, '').trim());
  if (tokens.length !== 2 || !tokens.every(token => decimalPattern.test(token))) {
    return undefined;
  }

  const latitude = Number(tokens[0]);
  const longitude = Number(tokens[1]);
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return undefined;
  }

  return { latitude, longitude };
}

function createPoint(coordinateValue: unknown, timestampValue: unknown): TimelinePoint | undefined {
  const coordinate = parseCoordinate(coordinateValue);
  const timestamp = parseTimestamp(timestampValue);
  return coordinate && timestamp ? { ...coordinate, timestamp } : undefined;
}

function appendPoint(points: TimelinePoint[], coordinate: unknown, timestamp: unknown): void {
  const point = createPoint(coordinate, timestamp);
  if (point) {
    points.push(point);
  }
}

function extractSegment(segmentValue: unknown): TimelinePoint[] {
  if (!isRecord(segmentValue)) {
    return [];
  }

  const points: TimelinePoint[] = [];
  appendPoint(points, segmentValue.latLng, segmentValue.startTime);

  if (isRecord(segmentValue.activity)) {
    appendPoint(points, segmentValue.activity.start, segmentValue.startTime);
    appendPoint(points, segmentValue.activity.end, segmentValue.endTime);
  }

  if (isRecord(segmentValue.visit)
    && isRecord(segmentValue.visit.topCandidate)) {
    appendPoint(
      points,
      segmentValue.visit.topCandidate.placeLocation,
      segmentValue.startTime,
    );
  }

  if (Array.isArray(segmentValue.timelinePath)) {
    for (const pathEntryValue of segmentValue.timelinePath) {
      if (!isRecord(pathEntryValue)) {
        continue;
      }

      appendPoint(
        points,
        pathEntryValue.point,
        parsePathTimestamp(pathEntryValue, segmentValue.startTime),
      );
    }
  }

  return points;
}

function uniqueSorted(points: TimelinePoint[]): TimelinePoint[] {
  const seen = new Set<string>();
  return points
    .filter((point) => {
      const key = `${point.timestamp}/${point.latitude}/${point.longitude}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .sort((left, right) => left.timestamp.localeCompare(right.timestamp));
}

export function normalizeTimeline(input: unknown): TimelineParseResult {
  let segments: unknown[] | undefined;

  if (Array.isArray(input)) {
    segments = input;
  }
  else if (isRecord(input) && Array.isArray(input.semanticSegments)) {
    segments = input.semanticSegments;
  }

  if (!segments) {
    return { points: [], error: 'unsupported-format' };
  }

  return {
    points: uniqueSorted(segments.flatMap(segment => extractSegment(segment))),
    error: undefined,
  };
}

export function localCalendarDate(timestamp: string): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function filterPointsByDate(
  points: TimelinePoint[],
  startDate: string,
  endDate: string,
): TimelinePoint[] {
  return points.filter(({ timestamp }) => {
    const date = localCalendarDate(timestamp);
    return date >= startDate && date <= endDate;
  });
}

export function calculateDistanceKm(points: TimelinePoint[]): number {
  if (points.length < 2) {
    return 0;
  }

  const earthRadiusKm = 6371;
  const degreesToRadians = (degrees: number) => degrees * Math.PI / 180;
  let distance = 0;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const latitudeDelta = degreesToRadians(current.latitude - previous.latitude);
    const longitudeDelta = degreesToRadians(current.longitude - previous.longitude);
    const latitude1 = degreesToRadians(previous.latitude);
    const latitude2 = degreesToRadians(current.latitude);
    const haversine = Math.sin(latitudeDelta / 2) ** 2
      + Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(longitudeDelta / 2) ** 2;
    distance += earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  }

  return distance;
}

export function projectTimelinePoints(
  points: TimelinePoint[],
  canvasWidth: number,
  canvasHeight: number,
): PreviewCoordinate[] {
  if (points.length === 0) {
    return [];
  }

  let minLatitude = points[0].latitude;
  let maxLatitude = points[0].latitude;
  let minLongitude = points[0].longitude;
  let maxLongitude = points[0].longitude;
  for (const { latitude, longitude } of points) {
    minLatitude = Math.min(minLatitude, latitude);
    maxLatitude = Math.max(maxLatitude, latitude);
    minLongitude = Math.min(minLongitude, longitude);
    maxLongitude = Math.max(maxLongitude, longitude);
  }

  const margin = 24;
  const width = Math.max(0, canvasWidth - margin * 2);
  const height = Math.max(0, canvasHeight - margin * 2);
  const latitudeRange = maxLatitude - minLatitude;
  const longitudeRange = maxLongitude - minLongitude;
  const coordinateAt = (index: number): PreviewCoordinate => {
    const { latitude, longitude } = points[index];
    const x = longitudeRange === 0
      ? margin + width / 2
      : margin + ((longitude - minLongitude) / longitudeRange) * width;
    const y = latitudeRange === 0
      ? margin + height / 2
      : margin + (1 - (latitude - minLatitude) / latitudeRange) * height;
    return { x, y };
  };

  if (points.length <= maxPreviewPoints) {
    return points.map((_, index) => coordinateAt(index));
  }

  return Array.from({ length: maxPreviewPoints }, (_, index) => {
    const sourceIndex = Math.round(index * (points.length - 1) / (maxPreviewPoints - 1));
    return coordinateAt(sourceIndex);
  });
}
