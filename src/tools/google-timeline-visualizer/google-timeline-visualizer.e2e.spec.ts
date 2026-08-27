import { Buffer } from 'node:buffer';

import { expect, test } from '@playwright/test';

test('registers local Timeline visualizer route', async ({ page }) => {
  await page.goto('/google-timeline-visualizer');

  await expect(page).toHaveTitle(/ - it-box$/);
  await expect(page.getByTestId('timeline-privacy-notice')).toBeVisible();
});

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

test('filters inclusively by local dates and redraws the preview', async ({ page }) => {
  await page.goto('/google-timeline-visualizer');
  await page.getByTestId('timeline-file-input').setInputFiles({
    name: 'three-days.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify([
      { startTime: '2025-01-01T12:00:00Z', latLng: '0,0' },
      { startTime: '2025-01-02T12:00:00Z', latLng: '0,1' },
      { startTime: '2025-01-03T12:00:00Z', latLng: '0,2' },
    ])),
  });

  await page.getByLabel('시작일').fill('2025-01-02');
  await page.getByLabel('종료일').fill('2025-01-03');

  await expect(page.getByTestId('timeline-summary')).toContainText('2개 지점 · 111.2 km');
  await expect(page.getByTestId('timeline-canvas')).toHaveAttribute('aria-label', '선택한 Timeline 경로 미리보기: 2개 지점');
});
