import { Typography } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.line-ending-converter.title'),
  path: '/line-ending-converter',
  description: translate('tools.line-ending-converter.description'),
  keywords: ['line endings', 'LF', 'CRLF', 'CR', 'newline', '줄바꿈', '개행'],
  component: () => import('./line-ending-converter.vue'),
  icon: Typography,
  createdAt: new Date('2026-10-02'),
});
