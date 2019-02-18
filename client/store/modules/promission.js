import { asyncRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = () => ({
  menuList: [],
  routers: []
})

const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.routers = routers;
  },
  UPDATE_MENULIST: (state) => {
    let menuList = [];
    let routers = state.routers;
    routers.forEach((item, index) => {
      if (item.children.length === 1) {
        menuList.push(item)
      } else {
        let len = menuList.push(item)
        let childrenArr = []
        childrenArr = item.children.filter(child => {
          return child
        })
        menuList[len - 1].children = childrenArr
      }
    });
    state.menuList = menuList;
    console.log('menuList', menuList)
  }
}

const actions = {
  generateRouters({ commit }, data) {
    return new Promise(resolve => {
      const { roles } = data
      let accessedRouters
      if (roles.includes('admin')) {
        accessedRouters = asyncRouterMap
      } else {
        accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
      }
      commit('SET_ROUTERS', accessedRouters)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


