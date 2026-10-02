import { exec } from 'node:child_process';
import { createServer } from 'node:http';
import { promisify } from 'node:util';
import { expect, it } from 'vitest';
import { generateHttpRequest } from './http-request-generator.models';

it('runs generated curl for bracket/braced URLs and HEAD without expansion or waiting for a body', async () => {
  const requests: string[] = [];
  const emptyHeaders: (string | string[] | undefined)[] = [];
  const server = createServer((request, response) => {
    requests.push(`${request.method} ${request.url}`);
    emptyHeaders.push(request.headers['x-empty']);
    response.setHeader('Content-Length', '5');
    response.end(request.method === 'HEAD' ? undefined : 'hello');
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Missing loopback address');
    }
    const url = `http://127.0.0.1:${address.port}/api?filter[status]={open,closed}`;
    const run = promisify(exec);
    await run(`${generateHttpRequest('GET', url, 'X-Empty:', '').curl} --silent --show-error --max-time 2`);
    await run(`${generateHttpRequest('HEAD', url, '', '').curl} --silent --show-error --max-time 2`);
    expect(requests).toEqual(['GET /api?filter[status]={open,closed}', 'HEAD /api?filter[status]={open,closed}']);
    expect(emptyHeaders).toEqual(['', undefined]);
  }
  finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});

it('rejects credential URLs and browser-forbidden HTTP methods', () => {
  expect(() => generateHttpRequest('GET', 'https://user:pass@example.com', '', '')).toThrow();
  for (const method of ['CONNECT', 'TRACE', 'TRACK']) {
    expect(() => generateHttpRequest(method, 'https://example.com', '', '')).toThrow();
  }
});
