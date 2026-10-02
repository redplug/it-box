import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-pointer.title'),
  path: '/json-pointer',
  description: translate('tools.json-pointer.description'),
  keywords: ['json', 'pointer', 'rfc 6901', '포인터', '경로', '조회'],
  component: () => import('./json-pointer.vue'),
  icon: Braces,
  createdAt: new Date('2026-10-02'),
});
