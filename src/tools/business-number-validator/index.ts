import { Building } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.business-number-validator.title'),
  path: '/business-number-validator',
  description: translate('tools.business-number-validator.description'),
  keywords: ['사업자등록번호', '법인등록번호', '사업자번호', '사업자 등록번호 검증', '법인번호 검증', 'business number', 'corporate number', 'korea', 'validator'],
  component: () => import('./business-number-validator.vue'),
  icon: Building,
  createdAt: new Date('2026-11-12'),
});
