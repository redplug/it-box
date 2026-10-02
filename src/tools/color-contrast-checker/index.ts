import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.color-contrast-checker.title'),
  path: '/color-contrast-checker',
  description: translate('tools.color-contrast-checker.description'),
  keywords: ['contrast', 'WCAG', 'accessibility', 'AA', 'AAA', '대비', '접근성', '색상'],
  component: () => import('./color-contrast-checker.vue'),
  icon: Palette,
  createdAt: new Date('2026-10-02'),
});
