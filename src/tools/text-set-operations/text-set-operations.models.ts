import { checkTextSize } from '../_shared/local-tool';

export function operateTextSets(first: string, second: string, operation: string): string[] {
  checkTextSize(first);
  checkTextSize(second);
  const left = new Set(first.split(/\r\n|\r|\n/).filter(line => line.trim()));
  const right = new Set(second.split(/\r\n|\r|\n/).filter(line => line.trim()));
  if (operation === 'union') {
    return [...new Set([...left, ...right])];
  }
  if (operation === 'intersection') {
    return [...left].filter(line => right.has(line));
  }
  if (operation === 'difference') {
    return [...left].filter(line => !right.has(line));
  }
  throw new Error('tools.text-set-operations.errors.invalidOperation');
}
