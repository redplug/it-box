import { Photo } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.image-converter.title'),
  path: '/image-converter',
  description: translate('tools.image-converter.description'),
  keywords: ['image', 'convert', 'compress', 'jpeg', 'webp', 'png', '이미지', '압축'],
  component: () => import('./image-converter.vue'),
  icon: Photo,
  createdAt: new Date('2026-10-02'),
});
