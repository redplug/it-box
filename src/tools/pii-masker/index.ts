import { ShieldLock } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.pii-masker.title'),
  path: '/pii-masker',
  description: translate('tools.pii-masker.description'),
  keywords: ['PII', 'masking', 'redact', 'personal information', 'log masking', '개인정보', '마스킹', '개인정보 마스킹', '주민등록번호', '전화번호', '이메일', '카드번호', '가명처리'],
  component: () => import('./pii-masker.vue'),
  icon: ShieldLock,
  createdAt: new Date('2026-11-12'),
});
