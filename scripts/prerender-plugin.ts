import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import MarkdownIt from 'markdown-it';
import { parse as parseYaml } from 'yaml';
import type { Plugin } from 'vite';
import { type Guide, parseGuide } from '../src/content/guides';
import { type ToolGuide, toolGuides } from '../src/content/tool-guides';

export interface PrerenderPage {
  path: string
  title: string
  description: string
  body: string
  lastmod: string
}

interface LocaleEntry { title?: string; description?: string }
interface Ko {
  tools?: Record<string, LocaleEntry>
  about: { content: string }
  privacy: { content: string }
  contact: { content: string }
}

export interface PrerenderInput {
  siteUrl: string
  template: string
  ko: Ko
  guides: Guide[]
  toolGuides: Record<string, ToolGuide>
  lastmod: string
}

const md = new MarkdownIt();

const STATIC_PAGES = [
  { path: '/about', title: '사이트 정보', description: 'it-box 운영자, 사이트 목적, 직접 만든 기능과 오픈소스 고지를 안내합니다.', key: 'about' },
  { path: '/privacy', title: '개인정보처리방침', description: 'it-box의 개인정보 처리 원칙과 광고, 문의 관련 안내입니다.', key: 'privacy' },
  { path: '/contact', title: '문의하기', description: 'it-box 버그 신고와 문의 방법을 안내합니다.', key: 'contact' },
] as const;

const HOME_INTRO = 'it-box는 JSON, JWT, Base64, 정규식, URL, SQL처럼 개발 중 자주 만나는 형식을 브라우저에서 확인할 수 있도록 모은 무료 도구 모음입니다. 각 도구의 결과만 보여주는 데서 끝나지 않고, 언제 사용하면 좋은지와 어떤 입력을 피해야 하는지도 함께 안내합니다.';

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Replaces one attribute of the <meta>/<link> tag that carries `selector="value"`.
export function setTagAttribute(html: string, tag: 'meta' | 'link', selector: string, selectorValue: string, attr: 'content' | 'href', value: string): string {
  const escapedValue = selectorValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<${tag}\\s[^>]*\\b${selector}="${escapedValue}"[^>]*>`, 'g');
  return html.replace(pattern, tagHtml => tagHtml.replace(new RegExp(`\\b${attr}="[^"]*"`), `${attr}="${escapeHtml(value)}"`));
}

export function readTagAttribute(html: string, selector: string, selectorValue: string, attr: 'content' | 'href'): string {
  const pattern = new RegExp(`<(?:meta|link)\\s[^>]*\\b${selector}="${selectorValue}"[^>]*>`);
  const tagHtml = html.match(pattern)?.[0] ?? '';
  return tagHtml.match(new RegExp(`\\b${attr}="([^"]*)"`))?.[1] ?? '';
}

export function renderPage(template: string, page: PrerenderPage, siteUrl: string): string {
  const url = `${siteUrl}${page.path === '/' ? '/' : page.path}`;
  const title = escapeHtml(page.title);
  const shell = [
    '<div id="app">',
    '<style>.prerender{max-width:760px;margin:0 auto;padding:24px;font-family:system-ui,sans-serif;line-height:1.7;color:#39424e}.prerender a{color:#18a058}</style>',
    '<div class="prerender">',
    '<header><a href="/">it-box</a></header>',
    `<main>${page.body}</main>`,
    '<footer><nav><a href="/about">사이트 정보</a> · <a href="/guides">가이드</a> · <a href="/privacy">개인정보처리방침</a> · <a href="/contact">문의</a></nav></footer>',
    '</div></div>',
  ].join('');

  let html = template.replace('<div id="app"></div>', () => shell);
  html = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${title}</title>`);
  html = setTagAttribute(html, 'meta', 'name', 'description', 'content', page.description);
  html = setTagAttribute(html, 'meta', 'itemprop', 'description', 'content', page.description);
  html = setTagAttribute(html, 'meta', 'property', 'og:description', 'content', page.description);
  html = setTagAttribute(html, 'meta', 'name', 'twitter:description', 'content', page.description);
  html = setTagAttribute(html, 'meta', 'property', 'og:title', 'content', page.title);
  html = setTagAttribute(html, 'meta', 'name', 'twitter:title', 'content', page.title);
  html = setTagAttribute(html, 'meta', 'itemprop', 'name', 'content', page.title);
  html = setTagAttribute(html, 'meta', 'property', 'og:url', 'content', url);
  html = setTagAttribute(html, 'link', 'rel', 'canonical', 'href', url);
  return html;
}

export function renderSitemap(pages: PrerenderPage[], siteUrl: string): string {
  const urls = pages.map(page => `  <url><loc>${siteUrl}${page.path}</loc><lastmod>${page.lastmod}</lastmod></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

function linkList(items: { href: string; label: string }[]): string {
  return `<ul>${items.map(item => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`).join('')}</ul>`;
}

export function buildPrerenderPages(input: PrerenderInput): { pages: PrerenderPage[]; missingToolKeys: string[] } {
  const { ko, guides, lastmod } = input;
  const tools = ko.tools ?? {};
  const missingToolKeys = Object.keys(input.toolGuides).filter(path => !tools[path.slice(1)]?.title || !tools[path.slice(1)]?.description);
  const pages: PrerenderPage[] = [];
  const guideLinks = guides.map(guide => ({ href: `/guides/${guide.slug}`, label: guide.title }));

  pages.push({
    path: '/',
    title: readTagText(input.template, 'title'),
    description: readTagAttribute(input.template, 'name', 'description', 'content'),
    body: [
      `<h1>${escapeHtml('개발 작업을 빠르게 확인하고 안전하게 정리하는 온라인 도구')}</h1>`,
      `<p>${escapeHtml(HOME_INTRO)}</p>`,
      '<h2>도구 목록</h2>',
      linkList(Object.keys(input.toolGuides).map(path => ({ href: path, label: tools[path.slice(1)]?.title ?? path }))),
      '<h2>사용 가이드</h2>',
      linkList(guideLinks),
    ].join('\n'),
    lastmod,
  });

  for (const page of STATIC_PAGES) {
    const body = (ko as unknown as Record<string, { content: string }>)[page.key].content;
    pages.push({ path: page.path, title: `${page.title} | it-box`, description: page.description, body: md.render(body), lastmod });
  }

  pages.push({
    path: '/guides',
    title: '개발 도구 사용 가이드 | it-box',
    description: 'JSON, JWT, Base64, 정규식, Cron을 안전하게 사용하는 방법을 정리했습니다.',
    body: [
      '<h1>도구를 안전하게 쓰는 법</h1>',
      ...guides.map(guide => `<article><h2><a href="/guides/${escapeHtml(guide.slug)}">${escapeHtml(guide.title)}</a></h2><p>${escapeHtml(guide.description)}</p></article>`),
    ].join('\n'),
    lastmod,
  });

  for (const guide of guides) {
    const related = guide.tools.map(path => ({ href: path, label: tools[path.slice(1)]?.title ?? path }));
    pages.push({
      path: `/guides/${guide.slug}`,
      title: `${guide.title} | it-box`,
      description: guide.description,
      body: [
        `<h1>${escapeHtml(guide.title)}</h1>`,
        `<p><time datetime="${escapeHtml(guide.date)}">${escapeHtml(guide.date)}</time></p>`,
        `<p>${escapeHtml(guide.description)}</p>`,
        md.render(guide.body),
        related.length > 0 ? `<h2>관련 도구</h2>${linkList(related)}` : '',
      ].join('\n'),
      lastmod: guide.date || lastmod,
    });
  }

  for (const [path, guide] of Object.entries(input.toolGuides)) {
    const entry = tools[path.slice(1)];
    const title = entry?.title ?? path;
    const description = entry?.description ?? guide.purpose;
    pages.push({
      path,
      title: `${title} - it-box`,
      description,
      body: [
        `<h1>${escapeHtml(title)}</h1>`,
        `<p>${escapeHtml(description)}</p>`,
        `<p><a href="${escapeHtml(path)}">${escapeHtml(title)} 도구 열기</a></p>`,
        `<p>${escapeHtml(guide.purpose)}</p>`,
        '<h2>사용 순서</h2>',
        `<ol>${guide.steps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol>`,
        '<h2>예시</h2>',
        `<p>${escapeHtml(guide.example)}</p>`,
        '<h2>한계</h2>',
        `<p>${escapeHtml(guide.limitations)}</p>`,
        '<h2>보안 주의</h2>',
        `<p>${escapeHtml(guide.safety)}</p>`,
        ...(guide.background?.length ? ['<h2>배경 지식</h2>', ...guide.background.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`)] : []),
        ...(guide.faq?.length ? ['<h2>자주 묻는 질문</h2>', ...guide.faq.flatMap(item => [`<h3>${escapeHtml(item.q)}</h3>`, `<p>${escapeHtml(item.a)}</p>`])] : []),
      ].join('\n'),
      lastmod,
    });
  }

  return { pages, missingToolKeys };
}

function readTagText(html: string, tag: 'title'): string {
  return html.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1] ?? '';
}

export function prerender(siteUrl: string): Plugin {
  let root = '';
  let outDir = '';

  return {
    name: 'prerender',
    apply: 'build',
    configResolved(config) {
      root = config.root;
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const template = readFileSync(join(outDir, 'index.html'), 'utf8');
      const ko = parseYaml(readFileSync(join(root, 'locales/ko.yml'), 'utf8')) as Ko;
      const guidesDir = join(root, 'src/content/guides');
      const guides = readdirSync(guidesDir)
        .filter(file => file.endsWith('.md'))
        .sort()
        .map(file => parseGuide(file.replace(/\.md$/, ''), readFileSync(join(guidesDir, file), 'utf8')));
      const lastmod = new Date().toISOString().slice(0, 10);

      const { pages, missingToolKeys } = buildPrerenderPages({ siteUrl, template, ko, guides, toolGuides, lastmod });
      if (missingToolKeys.length > 0) {
        console.warn(`[prerender] no locales/ko.yml title/description for ${missingToolKeys.length} tools, using fallbacks: ${missingToolKeys.join(', ')}`);
      }

      for (const page of pages) {
        const file = page.path === '/' ? join(outDir, 'index.html') : join(outDir, page.path.slice(1), 'index.html');
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, renderPage(template, page, siteUrl));
      }
      writeFileSync(join(outDir, 'sitemap.xml'), renderSitemap(pages, siteUrl));
    },
  };
}
