import { loginByUsername, logout, getUserInfo } from '../../api/login'
import { getToken, setToken, removeToken } from '../../utils/auth'

const state = () => ({
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [] // 权限
})

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }

}

const actions = {
  // 用户名登录
  LoginByUsername({ commit }, userInfo) {
    const username = userInfo.username.trim();
    return new Promise((resolve, reject) => {
      loginByUsername(username, userInfo.password).then(res => {
        const data = res.data;
        commit('SET_TOKEN', data.token);
        setToken(data.token);
        resolve();
      }).catch(err => {
        reject(err)
      })
    });
  },

  // 获取用户信息
  GetUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token).then(res => {
        const data = res.data;
        if (!data) {
          reject('Verification failed, please login again.');
        }

        if (data.roles && data.roles.length > 0) {
          commit('SET_ROLES', data.roles);
        } else {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_NAME', data.name);
        commit('SET_AVATAR', data.avatar);
        commit('SET_INTRODUCTION', data.introduction);
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    });
  },

  // 登出
  Logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        removeToken();
        resolve();
      }).catch(err => {
        reject(err)
      });
    });
  },

  // 前端登出
  FedLogout({ commit }) {
    return new promise(resolve => {
      commit('SET_TOKEN', '');
      removeToken();
      resolve();
    })
  },

  // 动态修改权限
  ChangeRoles({ commit, dispatch }, role) {
    return new Promise(resolve => {
      commit('SET_TOKEN', role);
      setToken(role);
      getUserInfo(role).then(res => {
        const data = res.data;
        commit('SET_ROLES', data.roles);
        commit('SET_NAME', data.name);
        commit('SET_AVATAR', data.avatar);
        commit('SET_INTRODUCTION', data.introduction);
        dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
        resolve();
      })
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
