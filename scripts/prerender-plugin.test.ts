import { describe, expect, it } from 'vitest';
import { buildPrerenderPages, renderPage, renderSitemap } from './prerender-plugin';

const template = `<!DOCTYPE html>
<html lang="ko">
  <head>
    <title>it-box | 개발자를 위한 온라인 도구</title>
    <meta
      name="description"
      content="home description"
    />
    <meta itemprop="name" content="it-box | 개발자를 위한 온라인 도구" />
    <meta property="og:url" content="https://it-box.dev/" />
    <meta property="og:title" content="it-box | 개발자를 위한 온라인 도구" />
    <meta name="twitter:title" content="it-box | 개발자를 위한 온라인 도구" />
    <meta name="twitter:description" content="home description" />
    <link rel="canonical" href="https://it-box.dev/" />
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>`;

const ko = {
  tools: { bcrypt: { title: 'bcrypt 해시 <테스트>', description: '비밀번호 "해시"' } },
  about: { content: '# 소개\n\n본문' },
  privacy: { content: '# 개인정보처리방침' },
  contact: { content: '# 문의하기' },
};

const toolGuides = {
  '/bcrypt': {
    purpose: 'purpose',
    steps: ['step 1'],
    example: 'example',
    limitations: 'limits',
    safety: 'safety',
    background: ['background & more'],
    faq: [{ q: 'Q?', a: 'A' }],
  },
};

const guides = [{ slug: 'a-guide', title: 'A 가이드', description: 'desc', date: '2026-11-10', tools: ['/bcrypt'], body: '본문' }];

describe('renderPage', () => {
  const { pages } = buildPrerenderPages({ siteUrl: 'https://it-box.dev', template, ko, guides, toolGuides, lastmod: '2026-11-10' });
  const bcrypt = pages.find(page => page.path === '/bcrypt')!;
  const html = renderPage(template, bcrypt, 'https://it-box.dev');

  it('replaces title, description, canonical and og tags', () => {
    expect(html).toContain('<title>bcrypt 해시 &lt;테스트&gt; - it-box</title>');
    expect(html).toContain('content="비밀번호 &quot;해시&quot;"');
    expect(html).toContain('<link rel="canonical" href="https://it-box.dev/bcrypt" />');
    expect(html).toContain('property="og:url" content="https://it-box.dev/bcrypt"');
    expect(html).not.toContain('home description');
  });

  it('injects escaped static body into the app mount point', () => {
    expect(html).toContain('<div id="app"><style>');
    expect(html).toContain('<h1>bcrypt 해시 &lt;테스트&gt;</h1>');
    expect(html).toContain('<h3>Q?</h3>');
    expect(html).toContain('background &amp; more');
    expect(html).not.toContain('<div id="app"></div>');
  });
});

describe('buildPrerenderPages', () => {
  it('creates unique titles and sitemap entries for every page', () => {
    const { pages, missingToolKeys } = buildPrerenderPages({ siteUrl: 'https://it-box.dev', template, ko, guides, toolGuides, lastmod: '2026-11-10' });
    const paths = pages.map(page => page.path);
    expect(paths).toEqual(expect.arrayContaining(['/', '/about', '/privacy', '/contact', '/guides', '/guides/a-guide', '/bcrypt']));
    expect(new Set(pages.map(page => page.title)).size).toBe(pages.length);
    expect(missingToolKeys).toEqual([]);
    expect(renderSitemap(pages, 'https://it-box.dev')).toContain('<loc>https://it-box.dev/guides/a-guide</loc><lastmod>2026-11-10</lastmod>');
  });

  it('falls back to the path and purpose when ko.yml has no entry', () => {
    const { pages, missingToolKeys } = buildPrerenderPages({ siteUrl: 'https://it-box.dev', template, ko: { ...ko, tools: {} }, guides, toolGuides, lastmod: '2026-11-10' });
    expect(missingToolKeys).toEqual(['/bcrypt']);
    expect(pages.find(page => page.path === '/bcrypt')?.title).toBe('/bcrypt - it-box');
  });
});
