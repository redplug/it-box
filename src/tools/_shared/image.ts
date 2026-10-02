const IMAGE_LIMIT = 10 * 1024 * 1024;
const PIXEL_LIMIT = 16_000_000;
export const imageFormats = ['image/png', 'image/jpeg', 'image/webp'] as const;
export type ImageFormat = typeof imageFormats[number];

export function checkImageFile(file: Blob): void {
  if (file.size > IMAGE_LIMIT) {
    throw new Error('tools.local.errors.fileTooLarge');
  }
  if (!imageFormats.includes(file.type as ImageFormat)) {
    throw new Error('tools.local.errors.unsupported');
  }
}

export function checkImageDimensions(width: number, height: number): void {
  if (![width, height].every(value => Number.isSafeInteger(value) && value > 0) || width * height > PIXEL_LIMIT) {
    throw new Error('tools.image-resizer.errors.dimensions');
  }
}

export function resizeDimensions(originalWidth: number, originalHeight: number, width: number, height: number, keepRatio: boolean) {
  checkImageDimensions(originalWidth, originalHeight);
  const target = { width, height: keepRatio ? Math.max(1, Math.round(width * originalHeight / originalWidth)) : height };
  checkImageDimensions(target.width, target.height);
  return target;
}

export async function loadRasterImage(file: Blob): Promise<HTMLImageElement> {
  checkImageFile(file);
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('tools.image-converter.errors.decode'));
      image.src = url;
    });
    checkImageDimensions(image.naturalWidth, image.naturalHeight);
    return image;
  }
  finally {
    URL.revokeObjectURL(url);
  }
}

export async function renderRasterImage(image: HTMLImageElement, width: number, height: number, format: ImageFormat, quality = 0.85): Promise<Blob> {
  checkImageDimensions(width, height);
  if (!imageFormats.includes(format) || !Number.isFinite(quality) || quality < 0 || quality > 1) {
    throw new Error('tools.local.errors.invalidInput');
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('tools.local.errors.unsupported');
  }
  if (format === 'image/jpeg') {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
  }
  context.drawImage(image, 0, 0, width, height);
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, format, quality));
  if (!blob || blob.type !== format) {
    throw new Error('tools.local.errors.unsupported');
  }
  return blob;
}
