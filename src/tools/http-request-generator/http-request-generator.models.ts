import { checkTextSize } from '../_shared/local-tool';
import { parseHttpHeaders } from '../http-headers-parser/http-headers-parser.models';

export function generateHttpRequest(methodInput: string, url: string, headerText: string, body: string): { fetch: string; curl: string } {
  for (const value of [methodInput, url, headerText, body]) {
    checkTextSize(value);
  }
  const method = methodInput.toUpperCase();
  if (!/^[!#$%&'*+.^_`|~\w-]+$/.test(method) || ['CONNECT', 'TRACE', 'TRACK'].includes(method)) {
    throw new Error('tools.http-request-generator.errors.invalidMethod');
  }
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  }
  catch {
    throw new Error('tools.http-request-generator.errors.invalidUrl');
  }
  // eslint-disable-next-line no-control-regex -- URL control characters can inject header lines.
  if (!['http:', 'https:'].includes(parsedUrl.protocol) || parsedUrl.username || parsedUrl.password || /[\u0000-\u0020\u007F]/.test(url)) {
    throw new Error('tools.http-request-generator.errors.invalidUrl');
  }
  if (body && ['GET', 'HEAD'].includes(method)) {
    throw new Error('tools.http-request-generator.errors.bodyNotAllowed');
  }
  if (body.includes('\u0000')) {
    throw new Error('tools.http-request-generator.errors.invalidBody');
  }
  let parsedHeaders: ReturnType<typeof parseHttpHeaders>;
  try {
    parsedHeaders = parseHttpHeaders(headerText);
  }
  catch {
    throw new Error('tools.http-request-generator.errors.invalidHeaders');
  }
  if (parsedHeaders.startLine) {
    throw new Error('tools.http-request-generator.errors.invalidHeaders');
  }
  const headers = Object.entries(parsedHeaders.headers).flatMap(([name, values]) => values.map(value => [name, value]));
  if (headers.some(([, value]) => /[\u0100-\uFFFF]/.test(value))) {
    throw new Error('tools.http-request-generator.errors.invalidHeaders');
  }
  const options = { method, headers, ...(body ? { body } : {}) };
  const quote = (value: string) => `'${value.replace(/'/g, '\'\\\'\'')}'`;
  const curl = [`curl --globoff --request ${quote(method)}`, ...(method === 'HEAD' ? ['--head'] : []), `--url ${quote(url)}`, ...headers.map(([name, value]) => `--header ${quote(value ? `${name}: ${value}` : `${name};`)}`), ...(body ? [`--data-raw ${quote(body)}`] : [])].join(' \\\n  ');
  return { fetch: `fetch(${JSON.stringify(url)}, ${JSON.stringify(options, null, 2)});`, curl };
}
