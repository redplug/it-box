import { Typography } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.string-escape-converter.title'),
  path: '/string-escape-converter',
  description: translate('tools.string-escape-converter.description'),
  keywords: ['string escape', 'JSON string', 'unescape', '문자열', '이스케이프'],
  component: () => import('./string-escape-converter.vue'),
  icon: Typography,
  createdAt: new Date('2026-10-02'),
});
