<template>
  <el-container style="height: 98.34vh;">

    <el-header style="background-color: #008997; color: #fff; text-align: center; display: flex;align-items: center;">
      <!-- <img src="nimenxuan" height="20px" width="20px"/> -->
      <p>Service Header</p>
      <el-button type='primary' style="margin-left: auto;">
        log out
      </el-button>
    </el-header>

    <el-container>
      <el-aside width="200px" style="background-color: #008997;">
        <el-menu default-active="1-1" class="el-menu-vertical-demo" text-color="#000000" active-text-color="#008997">
          <el-submenu index="1">
            <el-menu-item index="1-1">1</el-menu-item>
            <el-menu-item index="1-2">2</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <el-menu-item index="2-1">1</el-menu-item>
            <el-menu-item index="2-2">2</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <el-menu-item index="3-1">1</el-menu-item>
            <el-menu-item index="3-2">2</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <el-menu-item index="4-1">1</el-menu-item>
            <el-menu-item index="4-2">2</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      
      <el-main style="background-color: #E4E7ED; padding: 20px;">
        <Cesium></Cesium>
      </el-main>
      
    </el-container>
  </el-container>
</template>

<script setup>
  import Cesium from './Cesium.vue'
</script>

<style scoped>
.el-menu-vertical-demo {
  width: 100%;
}
.el-main {
  position: relative;
}
</style>
