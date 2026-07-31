import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PortfolioView from '../views/PortfolioView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { title: 'Filza Buana Putra | Web Developer & Personal Hub' }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: PortfolioView,
    meta: { title: 'Projects | Filza Buana Putra' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to) => {
  if (to.query && to.query.p) {
    const redirectPath = '/' + decodeURIComponent(to.query.p)
    return { path: redirectPath, replace: true }
  }
  document.title = to.meta.title || 'Filza Buana Putra'
})

export default router
