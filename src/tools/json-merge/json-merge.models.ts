import { isRecord, parseJson } from '../_shared/local-tool';

function checkDepth(value: unknown, depth = 0): void {
  if (depth > 64) {
    throw new Error('tools.json-merge.errors.tooDeep');
  }
  if (Array.isArray(value)) {
    value.forEach(item => checkDepth(item, depth + 1));
  }
  else if (isRecord(value)) {
    Object.values(value).forEach(item => checkDepth(item, depth + 1));
  }
}

function mergeObjects(left: Record<string, unknown>, right: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    [...new Set([...Object.keys(left), ...Object.keys(right)])].map((key) => {
      if (!Object.prototype.hasOwnProperty.call(right, key)) {
        return [key, left[key]];
      }
      const first = left[key];
      const second = right[key];
      return [
        key,
        Object.prototype.hasOwnProperty.call(left, key) && isRecord(first) && isRecord(second)
          ? mergeObjects(first, second)
          : second,
      ];
    }),
  );
}

export function mergeJson(leftText: string, rightText: string): string {
  const left = parseJson(leftText);
  const right = parseJson(rightText);
  if (!isRecord(left) || !isRecord(right)) {
    throw new Error('tools.json-merge.errors.objectsRequired');
  }
  checkDepth(left);
  checkDepth(right);
  return JSON.stringify(mergeObjects(left, right), null, 2);
}
