import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.env-to-json.title'),
  path: '/env-to-json',
  description: translate('tools.env-to-json.description'),
  keywords: ['env', 'dotenv', 'json', '환경변수', '설정', '변환'],
  component: () => import('./env-to-json.vue'),
  icon: Braces,
  createdAt: new Date('2026-10-02'),
});
