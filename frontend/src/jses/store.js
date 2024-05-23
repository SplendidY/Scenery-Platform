// store.js
import { createStore } from 'vuex';

const store = createStore({
  state: {
    username: localStorage.getItem('username') || '',
    password: localStorage.getItem('password') || ''
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
      localStorage.setItem('username', username);
    },
    setPassword(state, password) {
      state.password = password;
      localStorage.setItem('password', password);
    },
    clearUser(state) {
      state.username = '';
      state.password = '';
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }
  }
});

export default store;
