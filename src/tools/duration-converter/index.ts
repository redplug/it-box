import { Clock } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.duration-converter.title'),
  path: '/duration-converter',
  description: translate('tools.duration-converter.description'),
  keywords: ['duration', 'time', 'milliseconds', 'seconds', 'minutes', '기간', '시간', '초', '밀리초'],
  component: () => import('./duration-converter.vue'),
  icon: Clock,
  createdAt: new Date('2026-10-02'),
});
