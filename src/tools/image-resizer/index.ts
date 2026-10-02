import { Photo } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.image-resizer.title'),
  path: '/image-resizer',
  description: translate('tools.image-resizer.description'),
  keywords: ['image', 'resize', 'png', '이미지', '크기'],
  component: () => import('./image-resizer.vue'),
  icon: Photo,
  createdAt: new Date('2026-10-02'),
});
