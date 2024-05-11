<script setup>
       import{ ref,reactive} from 'vue'
       let loginUser =reactive({
        username:'',
        userPwd:''
       })
       let usernameMsg =ref('')
       let userPwdMsg = ref('')

</script>

<template>
  <div>
    <h3 class="ht">请登录</h3>
        <table class="tab" cellspacing="0px">
            <tr class="ltr">
                <td>请输入账号</td>
                <td>
                    <input class="ipt" 
                    type="text" 
                    v-model="loginUser.username">
                    <span id="usernameMsg" v-text="usernameMsg"></span>
                </td>
            </tr>
            <tr class="ltr">
                <td>请输入密码</td>
                <td>
                    <input class="ipt" 
                    type="password" 
                    v-model="loginUser.userPwd">
                    <span id="userPwdMsg" v-text="userPwdMsg"></span>
                </td>
            </tr>
            <tr class="ltr">
                <td colspan="2" class="buttonContainer">
                    <input class="btn1" type="button" value="登录">
                    <input class="btn1" type="button" value="重置">
                    <router-link to="/regist">
                      <button class="btn1">去注册</button>
                    </router-link>
                </td>
            </tr>
        </table>
    <router-link to="/regist" class="register-link">没有账号？立即注册</router-link>
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
        .register-link {
            display: block;
            text-align: center;
            margin-top: 20px;
}
</style>