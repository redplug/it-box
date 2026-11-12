import { CurrencyWon } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.korean-number-converter.title'),
  path: '/korean-number-converter',
  description: translate('tools.korean-number-converter.description'),
  keywords: ['korean number', 'hangul amount', 'number to korean', '한글 금액', '숫자 한글 변환', '금액 표기', '일백이십삼만', '억 만 단위'],
  component: () => import('./korean-number-converter.vue'),
  icon: CurrencyWon,
  createdAt: new Date('2026-11-12'),
});
