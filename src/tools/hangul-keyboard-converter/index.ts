import { Keyboard } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.hangul-keyboard-converter.title'),
  path: '/hangul-keyboard-converter',
  description: translate('tools.hangul-keyboard-converter.description'),
  keywords: ['한영 변환', '한/영', '두벌식', '한글 오타', '영타', '자판', 'hangul', 'korean keyboard', 'dubeolsik', 'keyboard layout'],
  component: () => import('./hangul-keyboard-converter.vue'),
  icon: Keyboard,
  createdAt: new Date('2026-11-12'),
});
