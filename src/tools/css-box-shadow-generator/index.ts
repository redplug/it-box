import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.css-box-shadow-generator.title'),
  path: '/css-box-shadow-generator',
  description: translate('tools.css-box-shadow-generator.description'),
  keywords: ['CSS', 'box-shadow', 'shadow', '그림자', '박스', 'inset'],
  component: () => import('./css-box-shadow-generator.vue'),
  icon: Palette,
  createdAt: new Date('2026-10-02'),
});
