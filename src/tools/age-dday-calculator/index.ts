import { CalendarEvent } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.age-dday-calculator.title'),
  path: '/age-dday-calculator',
  description: translate('tools.age-dday-calculator.description'),
  keywords: ['age', 'korean age', 'international age', 'd-day', 'dday', 'days', 'business days', 'date', 'calculator', '만 나이', '연 나이', '세는 나이', '디데이', '영업일', '날짜 더하기', '100일'],
  component: () => import('./age-dday-calculator.vue'),
  icon: CalendarEvent,
  createdAt: new Date('2026-11-12'),
});
