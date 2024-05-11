<script setup>

</script>

<template>
  <div>
    <h1 class="ht">欢迎使用智能文旅平台</h1>
    <div>
      <div  class="optionDiv">
        <router-link to="/login">
          <button class="b1s">登录</button>
        </router-link>   
        <router-link to="/regist">
          <button class="b1s">注册</button>
        </router-link>
      </div>


      <div   class="optionDiv">
        <button class="b1b">bbb</button> 
        <router-link to="/aaa">
          <button class="b1b">aaa</button>
        </router-link>
      </div>

      <br>
    </div>
  </div>
</template>

<style scoped>

  .ht{
    font: 36px "幼圆"; /*设置字体和字体大小*/
		   margin:50px auto; /*设置元素外边距*/
		   font-weight:400; /*设置字体粗细*/
		   text-align: center; /*设置文字居中*/
		   color: #f35626; /*设置文字颜色*/
		   animation:bounce 2s 5;/*设置动画*/
		}
		@keyframes bounce{/*创建动画*/
		   0%,100%,20%,50%,80%{
		      -webkit-transform:translateY(0);
		   }40%{
		      -webkit-transform:translateY(-20px);
		   }60%{
		      -webkit-transform:translateY(-10px);
		   }
  }
  .b1s{
        border-radius: 4px;
        width:60px;
    }

  .b1b{
      border-radius: 4px;
      width:100px;
  }
  .optionDiv{
    width: 300px;
    float: right;
  }
</style>