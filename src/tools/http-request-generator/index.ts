import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.http-request-generator.title'),
  path: '/http-request-generator',
  description: translate('tools.http-request-generator.description'),
  keywords: ['HTTP request', 'fetch', 'curl', 'POSIX', 'HTTP 요청', '코드 생성'],
  component: () => import('./http-request-generator.vue'),
  icon: World,
  createdAt: new Date('2026-10-02'),
});
