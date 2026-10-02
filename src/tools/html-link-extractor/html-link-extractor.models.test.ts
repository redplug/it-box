import { describe, expect, it } from 'vitest';
import { extractHtmlLinks } from './html-link-extractor.models';

describe('detached HTML link extraction', () => {
  it('extracts raw href and decoded text while retaining repeated links', () => {
    expect(extractHtmlLinks('<a href="/docs?x=1&amp;y=2">Docs &amp; help</a><a href="/docs">Again</a><a>No href</a>')).toEqual([{ href: '/docs?x=1&y=2', text: 'Docs & help' }, { href: '/docs', text: 'Again' }]);
  });
  it('resolves relatives against an explicit base and returns dangerous schemes only as text', () => {
    expect(extractHtmlLinks('<a href="../guide">Guide</a><a href="javascript:alert(1)">text<script>ignored</script></a>', 'https://example.com/docs/page')).toEqual([{ href: 'https://example.com/guide', text: 'Guide' }, { href: 'javascript:alert(1)', text: 'text' }]);
    expect(document.querySelector('a[href="javascript:alert(1)"]')).toBeNull();
  });
  it('rejects an invalid optional base', () => {
    expect(() => extractHtmlLinks('<a href="a">A</a>', 'invalid')).toThrow();
  });
});
