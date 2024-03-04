
const routes = [
  {
    path: '/tasks',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/TasksPage.vue')
      }
    ],
    meta: { requireAuth: true }
  },
  {
    path: '/categories',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/CategoriesPage.vue')
      }
    ],
    meta: { requireAuth: true }
  },
  {
    path: '',
    component: () => import('pages/LoginPage.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
