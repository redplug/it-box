import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-table.title'),
  path: '/json-table',
  description: translate('tools.json-table.description'),
  keywords: ['json', 'table', 'grid', '표', '테이블', '배열'],
  component: () => import('./json-table.vue'),
  icon: Braces,
  createdAt: new Date('2026-10-02'),
});
