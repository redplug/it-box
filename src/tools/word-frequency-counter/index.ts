import { Typography } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.word-frequency-counter.title'),
  path: '/word-frequency-counter',
  description: translate('tools.word-frequency-counter.description'),
  keywords: ['word frequency', 'token count', 'Unicode words', '단어 빈도', '토큰', '빈도수'],
  component: () => import('./word-frequency-counter.vue'),
  icon: Typography,
  createdAt: new Date('2026-10-02'),
});
