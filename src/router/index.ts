import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      props: true,
    },
    {
      path: '/clock/:userId',
      name: 'ClockManager',
      component: () => import('../components/ClockManager.vue'),
      props: true,
    },
    {
      path: '/workingtimes/:userId',
      name: 'getWorkingTimes',
      component: () => import('../components/WorkingTimes.vue'),
      props: true,
    },
    {
      //      path: '/workingtimes/:userId/:workingTimeId',
      path: '/workingtime/:userId',
      name: 'CUDWorkingTime',
      component: () => import('../components/WorkingTime.vue'),
      props: true,
    },
    {
      path: '/chartManager/:userId',
      name: 'ChartManager',
      component: () => import('../components/ChartManager.vue'),
      props: true,
    },
  ],
});

export default router;
