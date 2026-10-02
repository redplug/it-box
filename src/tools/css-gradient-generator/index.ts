import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.css-gradient-generator.title'),
  path: '/css-gradient-generator',
  description: translate('tools.css-gradient-generator.description'),
  keywords: ['CSS', 'gradient', 'linear-gradient', '그라데이션', '배경', '색상'],
  component: () => import('./css-gradient-generator.vue'),
  icon: Palette,
  createdAt: new Date('2026-10-02'),
});
