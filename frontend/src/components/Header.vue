<script setup>
</script>

<template>
  <div>
    <h1 class="ht">欢迎来到浙江省智慧文旅平台 !</h1>
  </div>
</template>

<style scoped>
.ht {
  font-size: 40px;
  margin: 30px auto;
  font-weight: 400;
  text-align: center;
  animation: bounce 2s infinite;
  color: white;
}
@keyframes bounce {
  0%,
  100%,
  20%,
  50%,
  80% {
    -webkit-transform: translateY(0);
  }
  40% {
    -webkit-transform: translateY(-10px);
  }
  60% {
    -webkit-transform: translateY(-5px);
  }
}
</style>