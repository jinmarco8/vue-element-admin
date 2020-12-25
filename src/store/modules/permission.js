import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.fID to determine if the current user has permission
 * roles is not reasonable for justify the menu list show or not
 * Here kenki add the meta.fID which the message from backend system.
 * If meta.fID is exist show menu else no show
 * If no meta.fID defined in the router/index.js, menu list will always show this function menu.
 * @param roles
 * @param route
 */
function hasPermissionByfID(fids, route) {
  if (route.meta && route.meta.fID) {
    // return fids.some(fid => route.meta.fID.includes(fid))
    return fids.includes(route.meta.fID)
  } else {
    // 如果想默认fids不配置不显示菜单，这里可以配置为false
    return true
  }
}

/**
 * Marked by kenki
 * Filter asynchronous routing tables by recursion
 * @param routes
 * @param fids
 * @returns {[]}
 */
export function filterAsyncRoutes(routes, fids) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermissionByfID(fids, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, fids)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, fids) {
    return new Promise(resolve => {
      let accessedRoutes = []
      /**
      // Justify roles from vue is funny so we don't need it.
      // But I will keep the roles input from routers for anything else
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      } **/
      accessedRoutes = filterAsyncRoutes(asyncRoutes, fids)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route

 function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}
 */

/**
 * marked by kenki
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles

 export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}
 */

