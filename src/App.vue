<script setup>
import Header from './components/Header.vue'
</script>

<template>
  <div>
    <div class="header-container">
    <Header></Header>
    </div>
    <div class="background-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.background-container {
  background-image: url('./assets/2.jpg');
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 100px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
 }
.header-container{
  background-image: url('./assets/1.jpg');
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100px;
  z-index: -1;
}
  </style>
