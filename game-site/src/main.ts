import { createApp } from 'vue';
import { startAnalytics } from './analytics';
import App from './App.vue';
import router from './router';
import './style.css';
import './shared/itbox-sidebar-menu.css';

startAnalytics();
createApp(App).use(router).mount('#app');
