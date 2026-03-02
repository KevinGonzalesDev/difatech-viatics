import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})



router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))

  if (to.meta.requiresAuth && !user) {
    return next('/login')
  }

  if (to.meta.roles) {
    const userRoles = user?.roles || []

    const hasAccess = to.meta.roles.some(role =>
      userRoles.includes(role)
    )

    if (!hasAccess) {
      return next('/dashboard') // o página 403
    }
  }

  next()
})



export default function (app) {
  app.use(router)
}
export { router }


