export const dataSizeUnits = [
  { unit: 'bit', bytes: 1 / 8, system: 'base' },
  { unit: 'byte', bytes: 1, system: 'base' },
  { unit: 'kB', bytes: 1e3, system: 'si' },
  { unit: 'MB', bytes: 1e6, system: 'si' },
  { unit: 'GB', bytes: 1e9, system: 'si' },
  { unit: 'TB', bytes: 1e12, system: 'si' },
  { unit: 'KiB', bytes: 1024, system: 'iec' },
  { unit: 'MiB', bytes: 1024 ** 2, system: 'iec' },
  { unit: 'GiB', bytes: 1024 ** 3, system: 'iec' },
  { unit: 'TiB', bytes: 1024 ** 4, system: 'iec' },
] as const;
export type DataSizeUnit = typeof dataSizeUnits[number]['unit'];

export function convertDataSize(value: number, unit: DataSizeUnit) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('tools.data-size-converter.errors.invalidValue');
  }
  const source = dataSizeUnits.find(row => row.unit === unit);
  if (!source) {
    throw new Error('tools.data-size-converter.errors.invalidUnit');
  }
  return dataSizeUnits.map((row) => {
    const converted = value * (source.bytes / row.bytes);
    if (!Number.isFinite(converted) || (value > 0 && converted === 0)) {
      throw new Error('tools.data-size-converter.errors.overflow');
    }
    return { unit: row.unit, system: row.system, value: converted };
  });
}

export function formatDataSize(value: number): string {
  return String(value);
}
