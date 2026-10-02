import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-merge.title'),
  path: '/json-merge',
  description: translate('tools.json-merge.description'),
  keywords: ['json', 'merge', 'deep merge', '병합', '합치기', '설정'],
  component: () => import('./json-merge.vue'),
  icon: Braces,
  createdAt: new Date('2026-10-02'),
});
