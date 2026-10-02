import { checkTextSize, isRecord, parseJson } from '../_shared/local-tool';

export function resolveJsonPointer(text: string, pointer: string): string {
  checkTextSize(pointer);
  let value = parseJson(text);
  if (pointer !== '' && (!pointer.startsWith('/') || /~(?:[^01]|$)/.test(pointer))) {
    throw new Error('tools.json-pointer.errors.invalidPointer');
  }
  for (const encoded of pointer === '' ? [] : pointer.slice(1).split('/')) {
    const key = encoded.replace(/~1/g, '/').replace(/~0/g, '~');
    if (Array.isArray(value)) {
      if (!/^(0|[1-9]\d*)$/.test(key) || !Number.isSafeInteger(Number(key))) {
        throw new Error('tools.json-pointer.errors.arrayIndex');
      }
      if (!Object.prototype.hasOwnProperty.call(value, key)) {
        throw new Error('tools.json-pointer.errors.missing');
      }
      value = value[Number(key)];
    }
    else if (isRecord(value) && Object.prototype.hasOwnProperty.call(value, key)) {
      value = value[key];
    }
    else {
      throw new Error('tools.json-pointer.errors.missing');
    }
  }
  return JSON.stringify(value, null, 2);
}
