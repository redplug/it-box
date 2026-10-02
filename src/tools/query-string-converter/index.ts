import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.query-string-converter.title'),
  path: '/query-string-converter',
  description: translate('tools.query-string-converter.description'),
  keywords: ['query string', 'URLSearchParams', 'JSON', '쿼리 문자열', '반복 키'],
  component: () => import('./query-string-converter.vue'),
  icon: World,
  createdAt: new Date('2026-10-02'),
});
