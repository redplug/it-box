import { isRecord, parseJson } from '../_shared/local-tool';

export function jsonToTable(text: string): { columns: string[]; rows: string[][] } {
  const value = parseJson(text);
  if (!Array.isArray(value) || !value.every(isRecord)) {
    throw new Error('tools.json-table.errors.objectsRequired');
  }
  const columns = [...new Set(value.flatMap(row => Object.keys(row)))];
  // ponytail: bound eager projection to 100 columns and 100,000 cells; project pages lazily if larger tables are needed.
  if (columns.length > 100) {
    throw new Error('tools.json-table.errors.tooWide');
  }
  if (columns.length * value.length > 100_000) {
    throw new Error('tools.json-table.errors.tooManyCells');
  }
  const rows = value.map(row =>
    columns.map(key =>
      Object.prototype.hasOwnProperty.call(row, key)
        ? typeof row[key] === 'string'
          ? (row[key] as string)
          : JSON.stringify(row[key])
        : '—',
    ),
  );
  return { columns, rows };
}

export function tablePage(rows: string[][], page: number): string[][] {
  return rows.slice((page - 1) * 50, page * 50);
}
