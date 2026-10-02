import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-lines-converter.title'),
  path: '/json-lines-converter',
  description: translate('tools.json-lines-converter.description'),
  keywords: ['jsonl', 'ndjson', 'json lines', 'json', '로그', '배열', '변환'],
  component: () => import('./json-lines-converter.vue'),
  icon: Braces,
  createdAt: new Date('2026-10-02'),
});
