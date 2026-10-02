export const TEXT_LIMIT = 2 * 1024 * 1024;

export function checkTextSize(text: string): void {
  if (new TextEncoder().encode(text).byteLength > TEXT_LIMIT) {
    throw new Error('tools.local.errors.textTooLarge');
  }
}

export function parseJson(text: string): unknown {
  checkTextSize(text);
  try {
    return JSON.parse(text);
  }
  catch {
    throw new Error('tools.local.errors.invalidJson');
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
