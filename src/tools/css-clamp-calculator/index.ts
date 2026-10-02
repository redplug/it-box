import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.css-clamp-calculator.title'),
  path: '/css-clamp-calculator',
  description: translate('tools.css-clamp-calculator.description'),
  keywords: ['CSS', 'clamp', 'fluid typography', 'rem', 'vw', '글꼴', '반응형'],
  component: () => import('./css-clamp-calculator.vue'),
  icon: Palette,
  createdAt: new Date('2026-10-02'),
});
