import { checkTextSize } from '../_shared/local-tool';

export function parseDetachedHtml(text: string): DocumentFragment {
  checkTextSize(text);
  const template = document.createElement('template');
  template.innerHTML = text;
  for (const element of template.content.querySelectorAll('script, style')) {
    element.remove();
  }
  return template.content;
}

export function textFromHtmlNode(root: Node): string {
  const blocks = new Set(['ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'DIV', 'DL', 'DT', 'DD', 'FIELDSET', 'FIGCAPTION', 'FIGURE', 'FOOTER', 'FORM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER', 'HR', 'LI', 'MAIN', 'NAV', 'OL', 'P', 'PRE', 'SECTION', 'TABLE', 'TR', 'UL']);
  const chunks: string[] = [];
  const stack: { node: Node; closing?: boolean }[] = [{ node: root }];
  const lineBreak = () => {
    if (chunks.length && !chunks[chunks.length - 1].endsWith('\n')) {
      chunks.push('\n');
    }
  };
  while (stack.length) {
    const { node, closing } = stack.pop()!;
    if (node.nodeType === Node.TEXT_NODE) {
      chunks.push(node.textContent ?? '');
      continue;
    }
    const name = node.nodeName;
    if (name === 'SCRIPT' || name === 'STYLE') {
      continue;
    }
    if (name === 'BR') {
      chunks.push('\n');
      continue;
    }
    if (closing || blocks.has(name)) {
      lineBreak();
    }
    if (closing) {
      continue;
    }
    if (blocks.has(name)) {
      stack.push({ node, closing: true });
    }
    for (let index = node.childNodes.length - 1; index >= 0; index--) {
      stack.push({ node: node.childNodes[index] });
    }
  }
  return chunks.join('').replace(/[ \t]+\n/g, '\n').replace(/\n[ \t]+/g, '\n').trim();
}

export function htmlToText(text: string): string {
  return textFromHtmlNode(parseDetachedHtml(text));
}
