import { Clock } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.data-size-converter.title'),
  path: '/data-size-converter',
  description: translate('tools.data-size-converter.description'),
  keywords: ['data', 'size', 'bit', 'byte', 'SI', 'IEC', 'KiB', '데이터', '크기', '바이트'],
  component: () => import('./data-size-converter.vue'),
  icon: Clock,
  createdAt: new Date('2026-10-02'),
});
