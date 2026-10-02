export function generateBorderRadius(topLeft: number, topRight: number, bottomRight: number, bottomLeft: number): string {
  const corners = [topLeft, topRight, bottomRight, bottomLeft];
  if (corners.some(value => !Number.isFinite(value) || value < 0)) {
    throw new Error('tools.css-border-radius-generator.errors.invalidRadius');
  }
  return corners.map(value => `${value}px`).join(' ');
}
