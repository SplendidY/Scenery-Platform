<script setup>

</script>

<template>
  <div>
    <h1 class="ht">Welcome to the Smart Tourism Platform !</h1>
    <div>
      <div class="optionDiv">
        <router-link to="/visitor">
          <button class="b1b">visitor</button>
        </router-link>
      </div>
      <br>
    </div>
  </div>
</template>

<style scoped>
.ht{
      margin:50px auto; /*设置元素外边距*/
      font-weight:400; /*设置字体粗细*/
      text-align: center; /*设置文字居中*/
      color: rgb(0, 64, 255); /*设置文字颜色*/
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
</style>