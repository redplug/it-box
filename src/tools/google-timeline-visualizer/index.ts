import { Route } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.google-timeline-visualizer.title'),
  path: '/google-timeline-visualizer',
  description: translate('tools.google-timeline-visualizer.description'),
  keywords: ['google', 'timeline', 'location history', 'travel', 'route', 'timeline.json'],
  component: () => import('./google-timeline-visualizer.vue'),
  icon: Route,
  createdAt: new Date('2026-08-27'),
});
