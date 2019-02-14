import Cookies from 'js-cookie'

const state = () => ({
  locales: ['en', 'zh'],
  locale: Cookies.get('language') || 'en'
})

const mutations = {
  SET_LANGUAGE: (state, locale) => {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale;
      Cookies.set('language', locale);
    }
  }
}

const actions = {
  SetLanguage({ commit }, locale) {
    commit('SET_LANGUAGE', locale);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
