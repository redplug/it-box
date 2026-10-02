import { checkTextSize } from '../_shared/local-tool';
import { parseDetachedHtml, textFromHtmlNode } from '../html-to-text/html-to-text.models';

export function extractHtmlLinks(text: string, baseUrl = ''): { href: string; text: string }[] {
  checkTextSize(baseUrl);
  let base: URL | undefined;
  if (baseUrl.trim()) {
    try {
      base = new URL(baseUrl);
    }
    catch {
      throw new Error('tools.html-link-extractor.errors.invalidBase');
    }
    if (!['http:', 'https:'].includes(base.protocol)) {
      throw new Error('tools.html-link-extractor.errors.invalidBase');
    }
  }
  return [...parseDetachedHtml(text).querySelectorAll('a[href]')].map((link) => {
    let href = link.getAttribute('href') ?? '';
    if (base) {
      try {
        href = new URL(href, base).href;
      }
      catch {
        // Invalid URLs remain visible as the original attribute for inspection.
      }
    }
    return { href, text: textFromHtmlNode(link) };
  });
}
