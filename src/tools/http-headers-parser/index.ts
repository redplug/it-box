import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.http-headers-parser.title'),
  path: '/http-headers-parser',
  description: translate('tools.http-headers-parser.description'),
  keywords: ['HTTP headers', 'header parser', 'request', 'response', 'HTTP 헤더', '헤더 분석'],
  component: () => import('./http-headers-parser.vue'),
  icon: World,
  createdAt: new Date('2026-10-02'),
});
