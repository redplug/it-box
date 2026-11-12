import { Ruler2 } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.korean-byte-counter.title'),
  path: '/korean-byte-counter',
  description: translate('tools.korean-byte-counter.description'),
  keywords: ['korean byte counter', 'byte count', 'character count', 'EUC-KR', 'CP949', 'SMS', 'LMS', 'VARCHAR', '글자수', '바이트', '한글 바이트', '자기소개서', '문자메시지', '글자 수 세기'],
  component: () => import('./korean-byte-counter.vue'),
  icon: Ruler2,
  createdAt: new Date('2026-11-12'),
});
