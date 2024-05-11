<script setup>
      import{ ref,reactive} from 'vue'
       let registUser =reactive({
        username:'',
        userPwd:''
       })

       let reUserPwd =ref('')
       let reUserPwdMsg =ref('')
       let usernameMsg =ref('')
       let userPwdMsg = ref('')

        function checkUsername(){
            let usernameReg=/^[a-zA-Z0-9]{5,10}$/
            if(!usernameReg.test(registUser.username)){
              usernameMsg.value = "不合法"
              return false
            }
            usernameMsg.value="OK"
            return true
        }
        function checkUserPwd(){
            let passwordReg=/^[0-9]{6}$/
             if(!passwordReg.test(registUser.userPwd)){
              userPwdMsg.value = "不合法"
              return false
            }
            userPwdMsg.value="OK"
            return true
        }
        function checkReUserPwd(){
            let passwordReg=/^[0-9]{6}$/
            if(!passwordReg.test(reUserPwd.value)){
              reUserPwdMsg.value = "不合法"
              return false
            }
            console.log(registUser.userPwd,reUserPwd.value)
            if(!(registUser.userPwd==reUserPwd.value)){
              reUserPwdMsg.value = "不一致"
              return false
            }

            reUserPwdMsg.value="OK"
            return true
        }
</script>

<template>
  <div>
    <h3 class="ht">请注册</h3>

    <table class="tab" cellspacing="0px">
        <tr class="ltr">
            <td>请输入账号</td>
            <td>
                <input class="ipt" 
                  id="usernameInput" 
                  type="text" 
                  name="username" 
                  v-model="registUser.username"
                  @blur="checkUsername()">

                <span id="usernameMsg" class="msg" v-text="usernameMsg"></span>
            </td>
        </tr>
        <tr class="ltr">
            <td>请输入密码</td>
            <td>
                <input class="ipt" 
                id="userPwdInput" 
                type="password" 
                name="userPwd" 
                v-model="registUser.userPwd"
                @blur="checkUserPwd()">
                <span id="userPwdMsg" class="msg" v-text="userPwdMsg"></span>
            </td>
        </tr>
        <tr class="ltr">
            <td>确认密码</td>
            <td>
                <input class="ipt" 
                id="reUserPwdInput" 
                type="password" 
                v-model="reUserPwd"
                @blur="checkReUserPwd()">
                <span id="reUserPwdMsg" class="msg" v-text="reUserPwdMsg"></span>
            </td>
        </tr>
        <tr class="ltr">
            <td colspan="2" class="buttonContainer">
                <input class="btn1" type="button" value="注册">
                <input class="btn1" type="button" value="重置">
                <router-link to="/login">
                  <button class="btn1">去登录</button>
                </router-link>
            </td>
        </tr>
    </table>


  </div>
</template>

<style scoped>
       .ht{
            text-align: center;
            font-family: 幼圆;
        }
        .tab{
            width: 500px;
            border: 5px solid;
            margin: 0px auto;
            border-radius: 5px;
            font-family: 幼圆;
        }
        .ltr td{
            border: 1px solid;

        }
        .ipt{
            border: 0px;
            width: 50%;

        }
        .btn1{
            border: 2px solid;
            border-radius: 4px;
            width:60px;

        }
        .buttonContainer{
            text-align: center;
        }
</style>
