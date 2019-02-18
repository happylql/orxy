import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import promission from './modules/promission'

import getters from './getters'

Vue.use(Vuex);

const store = () => new Vuex.Store({
  modules: {
    app,
    user,
    promission
  },
  getters,
  actions: {
    async nuxtServerInit({ commit }, { req, app }) {
      {
        // TODO: 权限处理
        // const { status, data: { menu } } = await app.$axios.get('home/menu');
        // commit('home/SET_MENU', status === 200 ? menu : []);
      }
    }
  }
})

export default store;
