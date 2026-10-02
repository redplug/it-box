import { Typography } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.text-set-operations.title'),
  path: '/text-set-operations',
  description: translate('tools.text-set-operations.description'),
  keywords: ['set operations', 'union', 'intersection', 'difference', '집합', '합집합', '교집합', '차집합'],
  component: () => import('./text-set-operations.vue'),
  icon: Typography,
  createdAt: new Date('2026-10-02'),
});
