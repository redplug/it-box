import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.css-border-radius-generator.title'),
  path: '/css-border-radius-generator',
  description: translate('tools.css-border-radius-generator.description'),
  keywords: ['CSS', 'border-radius', 'rounded', '모서리', '반경', '둥근'],
  component: () => import('./css-border-radius-generator.vue'),
  icon: Palette,
  createdAt: new Date('2026-10-02'),
});
