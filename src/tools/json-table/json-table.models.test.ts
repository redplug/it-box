import { describe, expect, it } from 'vitest';
import { jsonToTable, tablePage } from './json-table.models';

describe('JSON table', () => {
  it('uses first appearance columns and distinguishes absent fields from null', () => {
    expect(jsonToTable('[{"b":1,"a":null},{"c":{"x":1},"b":[2]}]')).toEqual({
      columns: ['b', 'a', 'c'],
      rows: [
        ['1', 'null', '—'],
        ['[2]', '—', '{"x":1}'],
      ],
    });
  });
  it('renders strings as strings and safely handles prototype names', () => {
    expect(jsonToTable('[{"__proto__":"<script>","constructor":true}]')).toEqual({
      columns: ['__proto__', 'constructor'],
      rows: [['<script>', 'true']],
    });
    expect(jsonToTable('[]')).toEqual({ columns: [], rows: [] });
  });
  it.each(['{}', '[1]', '[null]', '[[]]'])('requires an array of objects %s', (input) => {
    expect(() => jsonToTable(input)).toThrow('tools.json-table.errors.objectsRequired');
  });
  it('pages fifty rows at a time', () => {
    const rows = Array.from({ length: 105 }, (_, index) => [String(index)]);
    expect(tablePage(rows, 1)).toHaveLength(50);
    expect(tablePage(rows, 2)[0]).toEqual(['50']);
    expect(tablePage(rows, 3)).toEqual([['100'], ['101'], ['102'], ['103'], ['104']]);
  });
});

describe('table resource limits', () => {
  it('rejects wide sparse rows before building a cell cross-product', () => {
    const input = JSON.stringify(Array.from({ length: 101 }, (_, index) => ({ [`column${index}`]: index })));
    expect(() => jsonToTable(input)).toThrow('tools.json-table.errors.tooWide');
  });
  it('rejects too many projected cells without truncating data', () => {
    const input = JSON.stringify(Array.from({ length: 2000 }, (_, index) => ({ [`column${index % 100}`]: index })));
    expect(() => jsonToTable(input)).toThrow('tools.json-table.errors.tooManyCells');
  });
});
