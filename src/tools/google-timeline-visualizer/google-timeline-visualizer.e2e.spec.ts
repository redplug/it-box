import { Buffer } from 'node:buffer';

import { expect, test } from '@playwright/test';

test('shows local-processing notice and analyzes fictional Timeline file', async ({ page }) => {
  await page.goto('/google-timeline-visualizer');

  await expect(page.getByTestId('timeline-privacy-notice')).toContainText('브라우저에서만 처리');
  await page.getByTestId('timeline-file-input').setInputFiles({
    name: 'fictional-timeline.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify([
      { startTime: '2025-01-01T00:00:00Z', latLng: '37.5,127.0' },
      { startTime: '2025-01-02T00:00:00Z', latLng: '37.6,127.1' },
    ])),
  });

  await expect(page.getByTestId('timeline-summary')).toContainText('2');
  await expect(page.getByTestId('timeline-canvas')).toBeVisible();
});

test('rejects non-JSON input without rendering summary', async ({ page }) => {
  await page.goto('/google-timeline-visualizer');
  await page.getByTestId('timeline-file-input').setInputFiles({
    name: 'not-json.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('x'),
  });

  await expect(page.getByTestId('timeline-error')).toContainText('JSON');
  await expect(page.getByTestId('timeline-summary')).toHaveCount(0);
});

test('clears local analysis state', async ({ page }) => {
  await page.goto('/google-timeline-visualizer');
  await page.getByTestId('timeline-file-input').setInputFiles({
    name: 'fictional-timeline.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify([
      { startTime: '2025-01-01T00:00:00Z', latLng: '37.5,127.0' },
    ])),
  });

  await page.getByTestId('timeline-reset').click();
  await expect(page.getByTestId('timeline-summary')).toHaveCount(0);
});
