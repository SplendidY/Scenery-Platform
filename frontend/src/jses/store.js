import { createStore } from 'vuex';
//建立全局变量存储库
const store = createStore({
  state: {
    username: localStorage.getItem('username') || '',
    password: localStorage.getItem('password') || '',
    endj: '',
    endw: '',
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
    },
    setendw(state, endw) {
      state.endw = endw;
    },
    clearUser(state) {
      state.username = '';
      state.password = '';
      state.endj = '';
      state.endw = '';
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }
  }
});

export default store;