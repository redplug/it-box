export const durationUnits = [
  { unit: 'ms', milliseconds: 1 },
  { unit: 's', milliseconds: 1000 },
  { unit: 'min', milliseconds: 60000 },
  { unit: 'h', milliseconds: 3600000 },
  { unit: 'day', milliseconds: 86400000 },
  { unit: 'week', milliseconds: 604800000 },
] as const;
export type DurationUnit = typeof durationUnits[number]['unit'];

export function convertDuration(value: number, unit: DurationUnit) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('tools.duration-converter.errors.invalidValue');
  }
  const source = durationUnits.find(row => row.unit === unit);
  if (!source) {
    throw new Error('tools.duration-converter.errors.invalidUnit');
  }
  return durationUnits.map((row) => {
    const converted = value * (source.milliseconds / row.milliseconds);
    if (!Number.isFinite(converted) || (value > 0 && converted === 0)) {
      throw new Error('tools.duration-converter.errors.overflow');
    }
    return { unit: row.unit, value: converted };
  });
}
