import Vue from 'vue'
import * as filters from '../utils'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

export default filters
