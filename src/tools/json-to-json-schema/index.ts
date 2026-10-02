import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-to-json-schema.title'),
  path: '/json-to-json-schema',
  description: translate('tools.json-to-json-schema.description'),
  keywords: ['json', 'schema', 'draft 2020-12', '스키마', '검증', '생성'],
  component: () => import('./json-to-json-schema.vue'),
  icon: Braces,
  createdAt: new Date('2026-10-02'),
});
