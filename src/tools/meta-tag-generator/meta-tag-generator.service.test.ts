import { describe, expect, it } from 'vitest';
import { generateMetaTags } from './meta-tag-generator.service';

describe('meta-tag-generator', () => {
  it('writes the value as a content attribute', () => {
    const html = generateMetaTags({ title: 'Hello', twitter: { card: 'summary' } });

    expect(html).toContain('<meta property="og:title" content="Hello" />');
    expect(html).toContain('<meta name="twitter:card" content="summary" />');
    expect(html).not.toContain(' value=');
  });

  it('escapes double quotes, ampersands and less-than signs in attribute values', () => {
    const html = generateMetaTags({ title: 'a "b" & <c>' });

    expect(html).toContain('<meta property="og:title" content="a &quot;b&quot; &amp; &lt;c>" />');
  });
});
