import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    platform: null,
    listGroup: null,
    completionUrl: null,
    list: [],
    queue: {},
    index: -1,
    PROLIFIC_PID: null
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
