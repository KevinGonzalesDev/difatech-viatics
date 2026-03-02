export const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    meta: { requiresAuth: true },
    children: [

      { path: 'dashboard', component: () => import('@/pages/dashboard.vue') },
      { path: 'account-settings', component: () => import('@/pages/account-settings.vue') },
      { path: 'list-users', component: () => import('@/pages/list-users.vue'), meta: { roles: ['admin'] } },
      { path: 'list-roles', component: () => import('@/pages/list-roles.vue'), meta: { roles: ['admin'] } },
      { path: 'list-viaticos-user', component: () => import('@/pages/list-myviatics.vue'), meta: { roles: ['admin', 'tesoreria', 'employee', 'accounting'] } },
      { path: 'list-declaration-user', component: () => import('@/pages/list.userDeclaration.vue'), meta: { roles: ['admin', 'tesoreria', 'employee', 'accounting'] } },
      { path: 'list-viaticos-adm', component: () => import('@/pages/list-adm-viatics.vue'), meta: { roles: ['admin', 'tesoreria', 'accounting'] } },
      { path: 'list-costs', component: () => import('@/pages/list-costs.vue'), meta: { roles: ['admin', 'tesoreria'] } },
      { path: 'list-viaticos-aproved', component: () => import('@/pages/list-aproved-viatics.vue') },
      { path: 'proyect', component: () => import('@/pages/proyect.vue') },
      { path: 'company-info', component: () => import('@/pages/view.companySettings.vue') },
      { path: 'add-user', component: () => import('@/pages/add-user.vue') },
      { path: 'typography', component: () => import('@/pages/typography.vue') },
      { path: 'icons', component: () => import('@/pages/icons.vue') },
      { path: 'cards', component: () => import('@/pages/cards.vue') },
      { path: 'tables', component: () => import('@/pages/tables.vue') },
      { path: 'form-layouts', component: () => import('@/pages/form-layouts.vue') },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
        meta: { requiresGuest: true },
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
