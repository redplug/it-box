import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.cookie-parser.title'),
  path: '/cookie-parser',
  description: translate('tools.cookie-parser.description'),
  keywords: ['Cookie', 'request header', 'cookie parser', '쿠키', '쿠키 요청 헤더'],
  component: () => import('./cookie-parser.vue'),
  icon: World,
  createdAt: new Date('2026-10-02'),
});
