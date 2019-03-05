export const asyncRouterMap = [
  // {
  //   path: '/permission',
  //   alwaysShow: true, // will always show the root menu
  //   meta: {
  //     title: 'permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: '/permission/page',
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'pagePermission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     }
  //   ]
  // },
  {
    path: '/information',
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
          title: 'PlayerInformation',
          roles: ['admin']
        }
      }
    ]
  }
]
