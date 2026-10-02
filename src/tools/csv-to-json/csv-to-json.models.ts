import { checkTextSize } from '../_shared/local-tool';

export function csvToJson(text: string, delimiter: ',' | '\t' = ','): string {
  checkTextSize(text);
  const input = text.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let state: 'plain' | 'quoted' | 'closed' = 'plain';
  const invalid = () => {
    throw new Error('tools.csv-to-json.errors.malformed');
  };
  const finishCell = () => {
    row.push(cell);
    cell = '';
    state = 'plain';
  };
  for (let index = 0; index < input.length; index++) {
    const char = input[index];
    if (state === 'quoted') {
      if (char === '"') {
        if (input[index + 1] === '"') {
          cell += '"';
          index++;
        }
        else {
          state = 'closed';
        }
      }
      else {
        cell += char;
      }
    }
    else if (char === delimiter) {
      finishCell();
    }
    else if (char === '\n' || char === '\r') {
      finishCell();
      rows.push(row);
      row = [];
      if (char === '\r' && input[index + 1] === '\n') {
        index++;
      }
    }
    else if (state === 'closed') {
      invalid();
    }
    else if (char === '"') {
      if (cell !== '') {
        invalid();
      }
      state = 'quoted';
    }
    else {
      cell += char;
    }
  }
  if (state === 'quoted') {
    invalid();
  }
  if (row.length || cell !== '' || state === 'closed') {
    finishCell();
    rows.push(row);
  }
  const headers = rows.shift();
  if (!headers || headers.some(header => header.trim() === '') || new Set(headers).size !== headers.length) {
    throw new Error('tools.csv-to-json.errors.headers');
  }
  if (rows.some(values => values.length !== headers.length)) {
    throw new Error('tools.csv-to-json.errors.rowLength');
  }
  return JSON.stringify(
    rows.map(values => Object.fromEntries(headers.map((header, index) => [header, values[index]]))),
    null,
    2,
  );
}
