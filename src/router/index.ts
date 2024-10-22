import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

// Fonction simulant la vérification de l'authentification
function isAuthenticated() {
  return !!localStorage.getItem('token'); // Vérifie si un token JWT est présent
}

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: HomeView,
      props: true,
    },
    {
      path: '/',
      name: 'Login',
      component: () => import('../components/Auth/Login.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../components/Auth/Register.vue'),
    },
    {
      path: '/clock/:userId',
      name: 'ClockManager',
      component: () => import('../components/ClockManager.vue'),
      props: true,
      meta: { requiresAuth: true }, // Route protégée
    },
    {
      path: '/workingtimes/:userId',
      name: 'getWorkingTimes',
      component: () => import('../components/WorkingTimes.vue'),
      props: true,
      meta: { requiresAuth: true }, // Route protégée
    },
    {
      path: '/workingtime/:userId',
      name: 'CUDWorkingTime',
      component: () => import('../components/WorkingTime.vue'),
      props: true,
      meta: { requiresAuth: true }, // Route protégée
    },
    {
      path: '/chartManager/:userId',
      name: 'ChartManager',
      component: () => import('../components/ChartManager.vue'),
      props: true,
      meta: { requiresAuth: true }, // Route protégée
    },
  ],
});

// Protéger les routes nécessitant une authentification
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next({ name: 'Login' }); // Redirection vers la page de login
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
