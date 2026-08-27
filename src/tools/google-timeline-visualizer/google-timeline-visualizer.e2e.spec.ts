import { Buffer } from 'node:buffer';

import { expect, test } from '@playwright/test';

// Coordinates and future dates in this file are invented test data.
function activitySegment(startTime: string, endTime: string, start: string, end: string) {
  return {
    startTime,
    endTime,
    activity: {
      start: { latLng: start },
      end: { latLng: end },
    },
  };
}

test('registers the route with the complete local-processing and rights notice', async ({ page }) => {
  await page.goto('/google-timeline-visualizer');

  await expect(page).toHaveTitle(/ - it-box$/);
  const notice = page.getByTestId('timeline-privacy-notice');
  await expect(notice).toContainText('브라우저에서만 처리');
  await expect(notice).toContainText('외부 지도 요청');
  await expect(notice).toContainText('타인의 위치 정보');
  await expect(page.locator('.ad-slot')).toHaveCount(0);
});

test('analyzes nested segments and summarizes available and visited dates', async ({ page }) => {
  await page.goto('/google-timeline-visualizer');
  await page.getByTestId('timeline-file-input').setInputFiles({
    name: 'invented-timeline.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify([
      activitySegment('2051-01-01T12:00:00Z', '2051-01-01T13:00:00Z', 'geo:11,21', '11.5,21.5'),
      activitySegment('2051-01-03T12:00:00Z', '2051-01-03T13:00:00Z', '12,22', '12.5,22.5'),
    ])),
  });

  const summary = page.getByTestId('timeline-summary');
  await expect(summary).toContainText('분석 가능 기간: 2051-01-01 ~ 2051-01-03');
  await expect(summary).toContainText('4개 지점');
  await expect(summary).toContainText('방문한 날짜 2일');
  await expect(page.getByLabel('시작일')).toHaveAttribute('min', '2051-01-01');
  await expect(page.getByLabel('종료일')).toHaveAttribute('max', '2051-01-03');
  await expect(page.getByTestId('timeline-canvas')).toBeVisible();
});

test('filters an inclusive multi-day range and redraws its route preview', async ({ page }) => {
  await page.goto('/google-timeline-visualizer');
  await page.getByTestId('timeline-file-input').setInputFiles({
    name: 'invented-inclusive-range.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify([
      activitySegment('2051-04-01T12:00:00Z', '2051-04-01T13:00:00Z', '31,41', '31.5,41.5'),
      activitySegment('2051-04-02T12:00:00Z', '2051-04-02T13:00:00Z', '32,42', '32.5,42.5'),
      activitySegment('2051-04-03T12:00:00Z', '2051-04-03T13:00:00Z', '33,43', '33.5,43.5'),
    ])),
  });

  await page.getByLabel('시작일').fill('2051-04-02');
  await page.getByLabel('종료일').fill('2051-04-03');

  const summary = page.getByTestId('timeline-summary');
  await expect(page.getByLabel('시작일')).toHaveValue('2051-04-02');
  await expect(page.getByLabel('종료일')).toHaveValue('2051-04-03');
  await expect(summary).toContainText('4개 지점');
  await expect(summary).toContainText('방문한 날짜 2일');
  await expect(summary).toContainText('217.9 km');
  await expect(page.getByTestId('timeline-canvas')).toHaveAttribute('aria-label', /4개 지점/);
});

test('does not put Timeline-derived values in requests made during analysis', async ({ page }) => {
  await page.goto('/google-timeline-visualizer', { waitUntil: 'networkidle' });
  const requestPayloads: string[] = [];
  page.on('request', (request) => {
    requestPayloads.push(`${request.url()}\n${request.postData() ?? ''}`);
  });

  await page.getByTestId('timeline-file-input').setInputFiles({
    name: 'invented-sensitive-timeline.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify([
      activitySegment('2052-02-03T12:00:00Z', '2052-02-03T13:00:00Z', '-17.2345,63.9876', '-17.5,64.25'),
    ])),
  });
  await expect(page.getByTestId('timeline-summary')).toContainText('2개 지점');

  const outgoingText = requestPayloads.join('\n');
  expect(outgoingText).not.toContain('invented-sensitive-timeline');
  expect(outgoingText).not.toContain('-17.2345');
  expect(outgoingText).not.toContain('63.9876');
  expect(outgoingText).not.toContain('2052-02-03');
  expect(outgoingText).not.toContain('2개 지점');
});

test('rejects non-JSON and unsupported JSON without rendering analysis', async ({ page }) => {
  await page.goto('/google-timeline-visualizer');
  await page.getByTestId('timeline-file-input').setInputFiles({
    name: 'not-json.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('x'),
  });

  await expect(page.getByTestId('timeline-error')).toContainText('JSON');
  await expect(page.getByTestId('timeline-summary')).toHaveCount(0);

  await page.getByTestId('timeline-file-input').setInputFiles({
    name: 'unsupported.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"invented":true}'),
  });
  await expect(page.getByTestId('timeline-error')).toContainText('Timeline JSON');
  await expect(page.getByTestId('timeline-summary')).toHaveCount(0);
});

test('explains missing, reversed, out-of-bounds, and empty date ranges', async ({ page }) => {
  await page.goto('/google-timeline-visualizer');
  await page.getByTestId('timeline-file-input').setInputFiles({
    name: 'invented-date-range.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify([
      activitySegment('2053-03-01T12:00:00Z', '2053-03-01T13:00:00Z', '7,31', '7.25,31.25'),
      activitySegment('2053-03-03T12:00:00Z', '2053-03-03T13:00:00Z', '8,32', '8.25,32.25'),
    ])),
  });

  const rangeError = page.getByTestId('timeline-range-error');
  await page.getByLabel('시작일').fill('');
  await expect(rangeError).toContainText('시작일과 종료일을 모두 선택');

  await page.getByLabel('시작일').evaluate((input: HTMLInputElement) => {
    input.value = '2053-03-04';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.getByLabel('종료일').evaluate((input: HTMLInputElement) => {
    input.value = '2053-03-02';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(rangeError).toContainText('시작일은 종료일보다 늦을 수 없습니다');

  await page.getByLabel('시작일').evaluate((input: HTMLInputElement) => {
    input.value = '2053-02-28';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.getByLabel('종료일').fill('2053-03-01');
  await expect(rangeError).toContainText('분석 가능 기간 안에서 지정');

  await page.getByLabel('시작일').fill('2053-03-02');
  await page.getByLabel('종료일').fill('2053-03-02');
  await expect(rangeError).toContainText('선택한 기간에 위치 정보가 없습니다');
  await expect(page.getByTestId('timeline-canvas')).toHaveCount(0);
});

test('draws a visible marker for a one-point route', async ({ page }) => {
  await page.goto('/google-timeline-visualizer');
  await page.getByTestId('timeline-file-input').setInputFiles({
    name: 'invented-single-point.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      semanticSegments: [{
        startTime: '2054-04-01T12:00:00Z',
        visit: { topCandidate: { placeLocation: { latLng: '13,27' } } },
      }],
    })),
  });

  const canvas = page.getByTestId('timeline-canvas');
  await expect(canvas).toHaveAttribute('aria-label', /1개 지점/);
  await expect.poll(async () => canvas.evaluate((element: HTMLCanvasElement) => {
    const pixels = element.getContext('2d')?.getImageData(0, 0, element.width, element.height).data;
    return pixels ? pixels.some((value, index) => index % 4 === 3 && value > 0) : false;
  })).toBe(true);
});

test('clears local analysis state', async ({ page }) => {
  await page.goto('/google-timeline-visualizer');
  await page.getByTestId('timeline-file-input').setInputFiles({
    name: 'invented-reset.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify([
      activitySegment('2055-01-01T12:00:00Z', '2055-01-01T13:00:00Z', '14,28', '14.5,28.5'),
    ])),
  });

  await page.getByTestId('timeline-reset').click();
  await expect(page.getByTestId('timeline-summary')).toHaveCount(0);
});
