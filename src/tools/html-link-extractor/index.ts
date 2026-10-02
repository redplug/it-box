import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.html-link-extractor.title'),
  path: '/html-link-extractor',
  description: translate('tools.html-link-extractor.description'),
  keywords: ['HTML links', 'href', 'relative URL', 'link extractor', 'HTML 링크', '링크 추출'],
  component: () => import('./html-link-extractor.vue'),
  icon: World,
  createdAt: new Date('2026-10-02'),
});
