<template>
  <div class="container" :class="{ 'right-panel-active': isRightPanelActive }" >
    
  <div class="container__form container--signup">
    <form class="form" @submit.prevent="handleSubmitSignUp">  
      <h2 class="form__title">Sign Up</h2>
      <input type="text" v-model="signUpUser" placeholder="User(3-12characters)" class="input" @blur="checkUsername()"/>
      <span :class="{ 'error-text': !isUsernameValid }">{{ usernameMsg }}</span>
      <input type="password" v-model="signUpPassword" placeholder="Password(less than 20 characters)" class="input" @blur="checkUserPwd()"/>
      <span :class="{ 'error-text': !isPasswordValid }">{{ userPwdMsg }}</span>
      <button type="submit" class="btn">Sign Up</button>
    </form>
  </div>

  <div class="container__form container--signin">
    <form class="form" @submit.prevent="handleSubmitSignIn">
      <h2 class="form__title">Sign In</h2>
      <input type="text" v-model="signInUser" placeholder="User" class="input" />
      <input type="password" v-model="signInPassword" placeholder="Password" class="input" />
      <a href="#" class="link">Forgot your password?</a>
      <button type="submit" class="btn">Sign In</button>
    </form>
  </div>

  <!-- Overlay -->
  <div class="container__overlay">
    <div class="overlay">
      <div class="overlay__panel overlay--left">
      <router-link to="/login">
        <button class="btn" @click="toggleSignIn">Sign In</button>
      </router-link>
      </div>
      <div class="overlay__panel overlay--right">
      <router-link to="/regist">
        <button class="btn" @click="toggleSignUp">Sign Up</button>
      </router-link>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue'

let isRightPanelActive = ref(false);
let signUpUser = ref('');
let signUpPassword = ref('');
let signInPassword = ref('');
let signInUser = ref('');

const toggleSignIn = () => {
  isRightPanelActive.value = false;
};

const toggleSignUp = () => {
  isRightPanelActive.value = true;
};

const handleSubmitSignUp = () => {
  // 处理注册表单提交
};

const handleSubmitSignIn = () => {
  // 处理登录表单提交
};

let isUsernameValid = ref(true);
let isPasswordValid = ref(true);
let usernameMsg = ref('');
let userPwdMsg = ref('');

function checkUsername() {
  let usernameReg = /^[a-zA-Z0-9]{3,12}$/
  if (!usernameReg.test(signUpUser.value)) {
      isUsernameValid.value = false;
      usernameMsg.value = "illegal"
      return false
  }
  isUsernameValid.value = true;
  usernameMsg.value = "OK"
  return true
}

function checkUserPwd() {
  let passwordReg = /^[a-zA-Z0-9]{20}$/
  if (!passwordReg.test(signUpPassword.value)) {
      isPasswordValid.value = false;
      userPwdMsg.value = "illegal"
      return false
  }
  isPasswordValid.value = true;
  userPwdMsg.value = "OK"
  return true
}
// import {isRightPanelActive,signUpUser,signUpPassword,signInPassword,signInUser,toggleSignIn,toggleSignUp} from '../jses/Loginregist.js'
</script>

<style scoped>
.container {
  border-radius: 0.7rem;
  box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25), 0 0.7rem 0.7rem rgba(0, 0, 0, 0.22);
  height: 420px;
  max-width: 760px;
  overflow: hidden;
  position: relative;
  width: 100%;
  margin-top: 140px;
  margin-left: auto;
  margin-right: auto;
}

.container__form {
  height: 100%;
  position: absolute;
  top: 0;
  transition: all 0.6s ease-in-out;
}

.container--signin {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.right-panel-active .container--signin {
  transform: translateX(-100%);
}

.container--signup {
  left: 0;
  opacity: 0;
  width: 50%;
  z-index: 1;
}

.container.right-panel-active .container--signup {
  animation: show 0.6s;
  opacity: 1;
  transform: translateX(100%);
  z-index: 5;
}

.container__overlay {
  height: 100%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 0;
  transition: transform 0.6s ease-in-out;
  width: 50%;
  z-index: 100;
}

.container.right-panel-active .container__overlay {
  transform: translateX(-100%);
}

.overlay {
  background: url("../assets/2.jpg");
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  height: 100%;
  left: -100%;
  position: relative;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 200%;
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay__panel {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  position: absolute;
  text-align: center;
  top: 0;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 50%;
}

.overlay--left {
  transform: translateX(-20%);
}

.container.right-panel-active .overlay--left {
  transform: translateX(0);
}

.overlay--right {
  right: 0;
  transform: translateX(0);
}

.container.right-panel-active .overlay--right {
  transform: translateX(20%);
}

.btn {
  background-color: #008997;
  border-radius: 20px;
  border: 1px solid #008997;
  color: #e9e9e9;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.1rem;
  padding: 0.9rem 4rem;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
}

.form > .btn {
  margin-top: 1.5rem;
}

.btn:active {
  transform: scale(0.95);
}

.btn:focus {
  outline: none;
}

.form {
  background-color:white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 3rem;
  height: 100%;
  text-align: center;
}

.input {
  background-color: #ffffff;
  border: 1px solid #008997;
  padding: 0.9rem 0.9rem;
  margin: 0.5rem 0;
  width: 100%;
  text-align: left;
  color: #008997;
}

.input::placeholder {
  color: #008997;
}

h2,span {
  color: #008997;
}

.link {
  color: #008997;
  text-decoration:none;
}

.error-text {
  color: red;
}

</style>
