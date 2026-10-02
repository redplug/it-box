import { Typography } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.invisible-character-detector.title'),
  path: '/invisible-character-detector',
  description: translate('tools.invisible-character-detector.description'),
  keywords: ['invisible characters', 'zero width', 'NBSP', 'bidi', '보이지 않는 문자', '제어 문자'],
  component: () => import('./invisible-character-detector.vue'),
  icon: Typography,
  createdAt: new Date('2026-10-02'),
});
