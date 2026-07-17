import { createRouter, createWebHistory } from 'vue-router';
import { games } from './games/registry';
import Home from './pages/Home.vue';

const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://game.it-box.dev').replace(/\/$/, '');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { title: 'it-box games', description: '설치 없이 즐기는 간단한 무료 웹게임 모음입니다.' },
    },
    ...games.map(game => ({
      path: `/games/${game.slug}`,
      name: game.slug,
      component: game.component,
      meta: { title: `${game.title} | it-box games`, description: game.description },
    })),
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

router.afterEach((route) => {
  const title = String(route.meta.title || 'it-box games');
  const description = String(route.meta.description || '간단한 무료 웹게임 모음입니다.');
  const canonicalUrl = `${siteUrl}${route.path === '/' ? '/' : route.path}`;
  document.title = title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', description);
});

export default router;
