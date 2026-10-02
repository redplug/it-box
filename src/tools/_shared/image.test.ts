import { describe, expect, it } from 'vitest';
import { checkImageDimensions, checkImageFile, resizeDimensions } from './image';

describe('local raster image boundary', () => {
  it('rejects unsupported formats and large images', () => {
    expect(() => checkImageFile(new Blob(['x'], { type: 'image/svg+xml' }))).toThrow('tools.local.errors.unsupported');
    expect(() => checkImageFile(new Blob([new Uint8Array(10 * 1024 * 1024 + 1)], { type: 'image/png' }))).toThrow('tools.local.errors.fileTooLarge');
    expect(() => checkImageDimensions(5000, 5000)).toThrow('tools.image-resizer.errors.dimensions');
    expect(() => checkImageDimensions(0, 1)).toThrow();
  });
  it('preserves aspect ratio or uses explicit dimensions and validates output', () => {
    expect(resizeDimensions(800, 400, 200, 300, true)).toEqual({ width: 200, height: 100 });
    expect(resizeDimensions(800, 400, 200, 300, false)).toEqual({ width: 200, height: 300 });
    expect(() => resizeDimensions(800, 400, Number.NaN, 100, true)).toThrow();
    expect(() => resizeDimensions(800, 400, 9000, 9000, false)).toThrow();
  });
});
