import { Buffer } from 'node:buffer';
import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const textTools = [
  ['csv-to-json', 'Ada'],
  ['json-lines-converter', 'Ada'],
  ['json-to-typescript', 'Root'],
  ['json-to-json-schema', 'properties'],
  ['json-merge', ''],
  ['json-pointer', ''],
  ['json-table', 'Ada'],
  ['env-to-json', ''],
  ['query-string-converter', ''],
  ['http-headers-parser', ''],
  ['cookie-parser', ''],
  ['http-request-generator', 'fetch('],
  ['html-to-text', ''],
  ['html-link-extractor', 'href'],
  ['unicode-normalizer', ''],
  ['invisible-character-detector', 'U+'],
  ['line-ending-converter', ''],
  ['string-escape-converter', ''],
  ['text-set-operations', ''],
  ['word-frequency-counter', ''],
  ['css-gradient-generator', 'linear-gradient('],
  ['css-box-shadow-generator', 'box-shadow:'],
  ['css-border-radius-generator', 'border-radius:'],
  ['css-clamp-calculator', 'clamp('],
  ['color-contrast-checker', '4.47'],
  ['data-size-converter', ''],
  ['duration-converter', ''],
];

for (const [slug, sampleResult] of textTools) {
  test(`new tool: ${slug} supports direct access, sample and reset`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/${slug}`);
    await expect(page.locator('.tool-header h1')).toBeVisible();
    await expect(page.locator('.tool-header h1')).not.toContainText('tools.');
    await page.getByTestId('sample').click();
    const output = slug === 'json-table' ? page.getByTestId('json-table') : page.getByTestId('area-content').first();
    await expect(output).not.toHaveText('');
    if (sampleResult) {
      await expect(output).toContainText(sampleResult);
    }
    await expect(page.getByTestId('tool-error')).toHaveCount(0);
    await expect(page.locator('.tool-usage-guide')).toBeVisible();
    await page.getByTestId('reset').click();
    await expect(page.getByTestId('tool-error')).toHaveCount(0);
    await page.reload();
    await expect(page.locator('.tool-header h1')).toBeVisible();
    expect(errors).toEqual([]);
  });
}

for (const slug of ['image-resizer', 'image-converter']) {
  test(`new tool: ${slug} processes and downloads actual image bytes`, async ({ page }) => {
    await page.goto(`/${slug}`);
    await page.getByTestId('sample').click();
    await expect(page.getByTestId('convert')).toBeEnabled();
    if (slug === 'image-converter') {
      await page.getByTestId('format').selectOption('image/jpeg');
    }
    await page.getByTestId('convert').click();
    await expect(page.getByTestId('image-preview')).toBeVisible();
    await expect(page.getByTestId('area-content')).toContainText(slug === 'image-resizer' ? '200 × 100' : '2 × 1');
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('download').click();
    const download = await downloadPromise;
    const bytes = await readFile((await download.path())!);
    if (slug === 'image-resizer') {
      expect([...bytes.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
      expect(bytes.readUInt32BE(16)).toBe(200);
      expect(bytes.readUInt32BE(20)).toBe(100);
    }
    else {
      expect([...bytes.subarray(0, 2)]).toEqual([255, 216]);
      const pixel = await page.getByTestId('image-preview').evaluate((element: HTMLImageElement) => {
        const canvas = document.createElement('canvas');
        canvas.width = 2;
        canvas.height = 1;
        const context = canvas.getContext('2d')!;
        context.drawImage(element, 0, 0);
        return [...context.getImageData(1, 0, 1, 1).data];
      });
      expect(pixel[3]).toBe(255);
    }
    await page.getByTestId('reset').click();
    await expect(page.getByTestId('download')).toBeDisabled();
    await expect(page.getByTestId('image-preview')).toHaveCount(0);
  });
}

test('file hash computes a known checksum and invalidates when algorithm changes', async ({ page }) => {
  await page.goto('/file-hash-calculator');
  await page.getByTestId('sample').click();
  await page.getByTestId('calculate').click();
  await expect(page.getByTestId('area-content')).toHaveText('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  await page.getByTestId('algorithm').selectOption('SHA-384');
  await expect(page.getByTestId('area-content')).toHaveText('');
  await page.getByTestId('calculate').click();
  await expect(page.getByTestId('area-content')).toHaveText('cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7');
});

test('HTML analysis and request generation never execute input or send requests', async ({ page }) => {
  const unexpected: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('input-test.invalid')) {
      unexpected.push(request.url());
    }
  });
  await page.goto('/html-to-text');
  await page.getByTestId('input').fill('<p>Hello &amp; 한글</p><img src="https://input-test.invalid/a"><iframe src="https://input-test.invalid/b"></iframe><script>window.inputExecuted=true</script>');
  await expect(page.getByTestId('area-content')).toContainText('Hello & 한글');
  expect(await page.evaluate(() => 'inputExecuted' in window)).toBe(false);
  await page.goto('/html-link-extractor');
  await page.getByTestId('input').fill('<a href="https://input-test.invalid/link">link</a><img src="https://input-test.invalid/a">');
  await expect(page.getByTestId('area-content')).toContainText('input-test.invalid/link');
  await page.goto('/http-request-generator');
  await page.getByTestId('input').fill('https://input-test.invalid/api?filter[status]=open');
  await expect(page.getByTestId('area-content').first()).toContainText('fetch(');
  await expect(page.getByTestId('area-content').nth(1)).toContainText('--globoff');
  expect(unexpected).toEqual([]);
});

test('invalid JSON clears previous output without persisting input', async ({ page }) => {
  await page.goto('/json-to-typescript');
  await page.getByTestId('input').fill('{"privateExample":"secret-123"}');
  await expect(page.getByTestId('area-content')).toContainText('privateExample');
  await page.getByTestId('input').fill('{broken');
  await expect(page.getByTestId('tool-error')).toBeVisible();
  await expect(page.getByTestId('area-content')).toHaveText('');
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('secret-123');
  expect(page.url()).not.toContain('secret-123');
  await page.reload();
  await expect(page.getByTestId('input')).toHaveValue('');
});

test('new tools translate labels and errors when switching to English', async ({ page }) => {
  await page.goto('/json-to-typescript');
  await page.locator('.c-select-input').filter({ hasText: '한국어' }).click();
  await page.locator('.c-select-dropdown-option').filter({ hasText: /^English$/ }).click();
  await expect(page.locator('.tool-header h1')).toHaveText('JSON to TypeScript');
  await expect(page.getByTestId('sample')).toHaveText('Load example');
  await page.getByTestId('input').fill('{broken');
  await expect(page.getByTestId('tool-error')).toContainText('JSON');
  await expect(page.getByTestId('tool-error')).not.toContainText('tools.');
  await expect(page.getByTestId('tool-error')).toContainText('valid');
  await expect(page.getByTestId('reset')).toHaveText('Reset');
});

test('new tools are searchable and favorites survive reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /도구 검색/ }).click();
  await page.locator('.palette-modal input').fill('JSON Pointer');
  await page.getByRole('option').filter({ hasText: /JSON/ }).first().click();
  await expect(page).toHaveURL(/\/json-pointer$/);
  await page.locator('.tool-header button').click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('favoriteToolsName') ?? '[]'))).toContain('/json-pointer');
  await page.goto('/');
  const favorites = page.locator('.grid-wrapper h3').filter({ hasText: '즐겨찾는 도구' }).locator('..');
  await expect(favorites.locator('a[href="/json-pointer"]')).toBeVisible();
  await page.reload();
  await expect(favorites.locator('a[href="/json-pointer"]')).toBeVisible();
});

test('new tool remains usable by keyboard on a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/css-clamp-calculator');
  await page.getByTestId('sample').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('area-content')).toContainText('clamp(');
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('reset')).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('line ending download preserves exact CRLF bytes', async ({ page }) => {
  await page.goto('/line-ending-converter');
  await page.getByTestId('input').fill('first\nsecond\n');
  await page.getByTestId('ending').selectOption('CRLF');
  const pending = page.waitForEvent('download');
  await page.getByTestId('download').click();
  const download = await pending;
  expect(await readFile((await download.path())!)).toEqual(Buffer.from('first\r\nsecond\r\n'));
});

test('file hash ignores an old result after changing algorithm during reading', async ({ page }) => {
  await page.goto('/file-hash-calculator');
  await page.getByTestId('sample').click();
  await page.evaluate(() => {
    const state = window as Window & { releaseHash?: () => void; hashFinished?: boolean };
    const read = File.prototype.arrayBuffer;
    File.prototype.arrayBuffer = function () {
      return read.call(this).then(bytes => new Promise<ArrayBuffer>((resolve) => {
        state.releaseHash = () => resolve(bytes);
      }));
    };
    const digest = crypto.subtle.digest.bind(crypto.subtle);
    crypto.subtle.digest = async function (algorithm, data) {
      const result = await digest(algorithm, data);
      state.hashFinished = true;
      return result;
    };
  });
  await page.getByTestId('calculate').click();
  await page.waitForFunction(() => !!(window as Window & { releaseHash?: () => void }).releaseHash);
  await page.getByTestId('algorithm').selectOption('SHA-384');
  await page.evaluate(() => (window as Window & { releaseHash?: () => void }).releaseHash?.());
  await page.waitForFunction(() => (window as Window & { hashFinished?: boolean }).hashFinished);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
  await expect(page.getByTestId('area-content')).toHaveText('');
  await expect(page.getByTestId('calculate')).toBeEnabled();
});

test('image conversion ignores an old result after reset during encoding', async ({ page }) => {
  await page.goto('/image-converter');
  await page.getByTestId('sample').click();
  await expect(page.getByTestId('convert')).toBeEnabled();
  await page.evaluate(() => {
    const state = window as Window & { releaseImage?: () => void; imageFinished?: boolean };
    const encode = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function (callback, ...args) {
      encode.call(this, (blob) => {
        state.releaseImage = () => {
          callback(blob);
          state.imageFinished = true;
        };
      }, ...args);
    };
  });
  await page.getByTestId('convert').click();
  await page.waitForFunction(() => !!(window as Window & { releaseImage?: () => void }).releaseImage);
  await page.getByTestId('reset').click();
  await page.evaluate(() => (window as Window & { releaseImage?: () => void }).releaseImage?.());
  await page.waitForFunction(() => (window as Window & { imageFinished?: boolean }).imageFinished);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
  await expect(page.getByTestId('image-preview')).toHaveCount(0);
  await expect(page.getByTestId('area-content')).toHaveText('');
  await expect(page.getByTestId('download')).toBeDisabled();
});
