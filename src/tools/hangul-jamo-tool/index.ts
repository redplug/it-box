import { Language } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.hangul-jamo-tool.title'),
  path: '/hangul-jamo-tool',
  description: translate('tools.hangul-jamo-tool.description'),
  keywords: ['Hangul', 'jamo', 'chosung', 'initial consonant', 'korean', '한글', '자모', '자모 분리', '초성', '초성 추출', '초성 검색', '한글 음절'],
  component: () => import('./hangul-jamo-tool.vue'),
  icon: Language,
  createdAt: new Date('2026-11-12'),
});
