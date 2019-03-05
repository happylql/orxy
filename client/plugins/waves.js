import waves from '../directive/waves'
import Vue from 'vue'

const install = function (Vue) {
  Vue.directive('waves', waves)
}

Vue.use(install); // eslint-disable-line

waves.install = install

export default waves
