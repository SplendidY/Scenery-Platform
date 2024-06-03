import { createStore } from 'vuex';

const store = createStore({
  state: {
    username: localStorage.getItem('username') || '',
    password: localStorage.getItem('password') || '',
    endj: localStorage.getItem('endj') || '',
    endw: localStorage.getItem('endw') || '',
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
    setendj(state, endj) {
      state.endj = endj;
      localStorage.setItem('endj', endj);
    },
    setendw(state, endw) {
      state.endw = endw;
      localStorage.setItem('endw', endw);
    },
    clearUser(state) {
      state.username = '';
      state.password = '';
      state.endj = '';
      state.endw = '';
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      localStorage.removeItem('endj');
      localStorage.removeItem('endw');
    }
  }
});

export default store;