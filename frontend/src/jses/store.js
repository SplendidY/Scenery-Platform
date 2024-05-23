import { createStore } from 'vuex';

export default createStore({
  state: {
    username: '',
    password: ''
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
    setPassword(state, password) {
      state.password = password;
    }
  }
});