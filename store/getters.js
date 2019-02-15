const getters = {
  device: state => state.app.device,
  sidebar: state => state.app.sidebar,
  locales: state => state.app.locales,
  locale: state => state.app.locale,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews
}

export default getters
