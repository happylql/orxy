import Vue from 'vue'
import Element from 'element-ui'
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'

// After plugin: i18n.js
export default ({ store: { state } }) => {
  const locale = state.app.locale === 'en' ? elementEnLocale : elementZhLocale
  Vue.use(Element, { locale })
}
