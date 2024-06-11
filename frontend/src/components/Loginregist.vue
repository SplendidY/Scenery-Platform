<template>
  <div>
    <div class="background-container">
      <Header></Header>
      <div class="container" :class="{ 'right-panel-active': isRightPanelActive }">
        <div class="container__form container--signup">
          <form class="form" @submit.prevent="handleSubmitSignUp">
            <p class="form__title">Sign Up</p>
            <input type="text" v-model="signUpUser" placeholder="User(3-12characters)" class="input" @blur="checkUsername()" />
            <span :class="{ 'error-text': !isUsernameValid }">{{ usernameMsg }}</span>
            <input type="password" v-model="signUpPassword" placeholder="Password(6-20characters)" class="input" @blur="checkUserPwd()" />
            <span :class="{ 'error-text': !isPasswordValid }">{{ userPwdMsg }}</span>
            <button type="submit" class="btn">Sign Up</button>
          </form>
        </div>

        <div class="container__form container--signin">
          <form class="form" @submit.prevent="handleSubmitSignIn">
            <p class="form__title">Sign In</p>
            <input type="text" v-model="signInUser" placeholder="User" class="input" />
            <input type="password" v-model="signInPassword" placeholder="Password" class="input" />
            <a href="https://www.youlai.cn/yyk/article/322086.html" class="link">Forgot your password?</a>
            <button type="submit" class="btn" id="inbtn">Sign In</button>
          </form>
        </div>

        <!-- 遮罩 -->
        <div class="container__overlay">
          <div class="overlay">
            <div class="overlay__panel overlay--left">
              <router-link to="/login">
                <button class="btn" @click="toggleSignIn" id="changein">Sign In</button>
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
import Header from './Header.vue'
import { ElMessage } from 'element-plus'

let isRightPanelActive = ref(false);
let signUpUser = ref('');
let signUpPassword = ref('');
let signInPassword = ref('');
let signInUser = ref('');
let isUsernameValid = ref(false);
let isPasswordValid = ref(false);
let usernameMsg = ref('');
let userPwdMsg = ref('');

const router = useRouter();
const store = useStore();

const toggleSignIn = () => {
  isRightPanelActive.value = false;
};

const toggleSignUp = () => {
  isRightPanelActive.value = true;
};
//处理注册登录
const handleSubmitSignUp = async () => {
  if (isUsernameValid.value && isPasswordValid.value) {
    try {
      const response = await fetch('http://localhost:5001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: signUpUser.value,
          password: signUpPassword.value
        })
      });
      const data = await response.json();
      if (response.ok) {
        ElMessage.success({message:'Regist successfully!',showClose:true});
        toggleSignIn(); // 切换登录界面
      } else {
        ElMessage.error({message:`Regist failed:${data.message}`,showClose:true});
      }
    } catch (error) {
      ElMessage.error({message:'Network errors or server unresponsiveness',showClose:true});
    }
  }
};

const handleSubmitSignIn = async () => {
  try {
    const response = await fetch('http://localhost:5001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: signInUser.value,
        password: signInPassword.value
      })
    });
    const data = await response.json();
    if (response.ok) {
      store.commit('setUsername', data['username']);
      store.commit('setPassword', data['password']);
      ElMessage.success({message:'Login successfully!',showClose:true});
      router.push({ path: '/service' });
    } else {
      ElMessage.error({message:`Login failed:${data.message}`,showClose:true});
    }
  } catch (error) {
    ElMessage.error({message:'Network errors or server unresponsiveness',showClose:true});
  }
};
//检查账号密码格式
function checkUsername() {
  const usernameReg = /^.{3,12}$/;
  if (!usernameReg.test(signUpUser.value)) {
    isUsernameValid.value = false;
    usernameMsg.value = "Username should be 3-12 characters";
    return false;
  }
  isUsernameValid.value = true;
  usernameMsg.value = "OK";
  return true;
}

function checkUserPwd() {
  const passwordReg = /^[a-zA-Z0-9!@#$%^&*()_+.,/;'']{6,20}$/;
  if (!passwordReg.test(signUpPassword.value)) {
    isPasswordValid.value = false;
    userPwdMsg.value = "Password should be 6-20 characters";
    return false;
  }
  isPasswordValid.value = true;
  userPwdMsg.value = "OK";
  return true;
}
</script>


<style scoped>
.container {
  border-radius: 0.7rem;
  box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25), 0 0.7rem 0.7rem rgba(0, 0, 0, 0.22);
  height: 500px;
  max-width: 900px;
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
  transition: all 0.8s ease-in-out;
}

.container--signin {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.right-panel-active .container--signin {
  animation: show 0.8s;
  opacity: 1;
  transform: translateX(-100%);
  z-index: 5;
}

.container--signup {
  left: 0;
  opacity: 0;
  width: 50%;
  z-index: 1;
}

.container.right-panel-active .container--signup {
  animation: show 0.8s;
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
  transition: transform 0.8s ease-in-out;
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
  transition: transform 0.8s ease-in-out;
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
  transition: transform 0.8s ease-in-out;
  width: 50%;
}

.overlay--left {
  transform: translateX(-30%);
}

.container.right-panel-active .overlay--left {
  transform: translateX(0);
}

.overlay--right {
  right: 0;
  transform: translateX(0);
}

.container.right-panel-active .overlay--right {
  transform: translateX(30%);
}

.btn {
  background-color: #008997;
  border-radius: 20px;
  border: 1px solid #008997;
  color: #e9e9e9;
  cursor: pointer;
  font-size: 0.9rem;
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

p,span {
  color: #008997;
}
p {
  font-size: 25px;
}
.link {
  color: #008997;
  text-decoration:none;
}

.error-text {
  color: red;
}

#inbtn {
  position:relative;
  margin-top: 10px;
}

#changein{
  position: relative;
  margin-bottom: 5px;
}

.background-container {
  background-image: url('../assets/2.jpg');
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
 }
</style>