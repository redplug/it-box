import { Hash } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.file-hash-calculator.title'),
  path: '/file-hash-calculator',
  description: translate('tools.file-hash-calculator.description'),
  keywords: ['file', 'hash', 'checksum', 'sha256', 'sha384', 'sha512', '파일', '해시'],
  component: () => import('./file-hash-calculator.vue'),
  icon: Hash,
  createdAt: new Date('2026-10-02'),
});
