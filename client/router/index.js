export const asyncRouterMap = [
  {
    path: '/',
    meta: {
      title: 'dashboard',
      icon: 'excel',
      roles: ['admin']
    }
  },
  {
    path: '/information',
    alwaysShow: true,
    meta: {
      title: 'information',
      icon: 'excel',
      roles: ['admin']
    },
    children: [
      {
        path: '/information/player',
        name: 'PlayerInformation',
        meta: {
          title: 'playerInformation',
          roles: ['admin']
        }
      }
    ]
  }
]
