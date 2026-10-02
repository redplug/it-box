import { Typography } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.unicode-normalizer.title'),
  path: '/unicode-normalizer',
  description: translate('tools.unicode-normalizer.description'),
  keywords: ['Unicode', 'NFC', 'NFD', 'NFKC', 'NFKD', '유니코드', '정규화'],
  component: () => import('./unicode-normalizer.vue'),
  icon: Typography,
  createdAt: new Date('2026-10-02'),
});
