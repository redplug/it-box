import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-to-typescript.title'),
  path: '/json-to-typescript',
  description: translate('tools.json-to-typescript.description'),
  keywords: ['json', 'typescript', 'type', 'interface', '타입', '타입스크립트', '생성'],
  component: () => import('./json-to-typescript.vue'),
  icon: Braces,
  createdAt: new Date('2026-10-02'),
});
