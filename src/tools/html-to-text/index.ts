import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.html-to-text.title'),
  path: '/html-to-text',
  description: translate('tools.html-to-text.description'),
  keywords: ['HTML', 'plain text', 'entity decode', 'HTML 텍스트', '엔티티'],
  component: () => import('./html-to-text.vue'),
  icon: World,
  createdAt: new Date('2026-10-02'),
});
