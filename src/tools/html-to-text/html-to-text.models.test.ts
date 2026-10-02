import { describe, expect, it } from 'vitest';
import { htmlToText } from './html-to-text.models';

describe('detached HTML text conversion', () => {
  it('decodes entities and retains block and br line breaks without scripts and styles', () => {
    expect(htmlToText('<p>Hello &amp; 안녕</p><div>next<br>line</div><script>bad()</script><style>.bad{}</style>')).toBe('Hello & 안녕\nnext\nline');
  });
  it('does not mount pasted markup or run scripts', () => {
    expect(htmlToText('<img id="pasted-image" src="https://example.com/x"><script>document.body.id="injected"</script><b>safe</b>')).toBe('safe');
    expect(document.getElementById('pasted-image')).toBeNull();
    expect(document.body.id).not.toBe('injected');
  });
  it('handles deep markup without recursive traversal', () => {
    expect(htmlToText(`${'<div>'.repeat(300)}deep${'</div>'.repeat(300)}`)).toBe('deep');
  });
  it('preserves consecutive explicit line breaks', () => {
    expect(htmlToText('<p>a<br><br>b</p><p>c</p>')).toBe('a\n\nb\nc');
  });
});
