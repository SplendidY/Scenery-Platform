<template>
  <div style="height: 100vh; display: flex; flex-direction: column; overflow: hidden;">
    <div style="position: absolute; top: 20px; left: 20px; z-index: 999;">
      <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
        <el-radio-button :value="false">expand</el-radio-button>
        <el-radio-button :value="true">collapse</el-radio-button>
      </el-radio-group>
    </div>
    <el-menu
      default-active="2"
      class="el-menu-vertical"
      :collapse="isCollapse"
      style="position: absolute; top: 60px; left: 20px; z-index: 998;"
      @select="handleSelect1"
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><location /></el-icon>
          <span>Navigator One</span>
        </template>
        <el-menu-item-group>
          <template #title><span>Group One</span></template>
          <el-menu-item index="1-1">item one</el-menu-item>
          <el-menu-item index="1-2">item two</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group Two">
          <el-menu-item index="1-3">item three</el-menu-item>
        </el-menu-item-group>
        <el-sub-menu index="1-4">
          <template #title><span>item four</span></template>
          <el-menu-item index="1-4-1">item one</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
      <el-menu-item index="2">
        <el-icon><icon-menu /></el-icon>
        <template #title>Navigator Two</template>
      </el-menu-item>
      <el-menu-item index="3">
        <el-icon><document /></el-icon>
        <template #title>Navigator Three</template>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><setting /></el-icon>
        <template #title>Navigator Four</template>
      </el-menu-item>
    </el-menu>
    <el-container style="flex: 1; display: flex; flex-direction: column;">
      <el-main style="flex: 1; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;">
          <Cesium />
        </div>
      </el-main>
      <el-footer style="padding: 0; width: 100%;">
        <el-menu
          active-text-color="#ffd04b"
          background-color="#545c64"
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          text-color="#fff"
          @select="handleSelect2"
          style="width: 100%; margin: 0; border: none;"
        >
          <div class="flex-grow" />
          <el-menu-item index="1">&nbsp;&nbsp;&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;</el-menu-item>
          <el-sub-menu index="2">
            <template #title>&nbsp;&nbsp;&nbsp;&nbsp;Layer select&nbsp;&nbsp;&nbsp;&nbsp;</template>
            <el-menu-item index="2-1">Layer1</el-menu-item>
            <el-menu-item index="2-2">Layer2</el-menu-item>
            <el-menu-item index="2-3">Layer3</el-menu-item>
            <el-sub-menu index="2-4">
              <template #title>layer4</template>
              <el-menu-item index="2-4-1">Layer4-1</el-menu-item>
              <el-menu-item index="2-4-2">Layer4-2</el-menu-item>
              <el-menu-item index="2-4-3">Layer4-3</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="3">&nbsp;&nbsp;&nbsp;&nbsp;3&nbsp;&nbsp;&nbsp;&nbsp;</el-menu-item>
        </el-menu>
      </el-footer>
    </el-container>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import Cesium from './Cesium.vue'

const isCollapse = ref(true)

</script>

<style>
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}
.flex-grow {
  flex-grow: 0;
}
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.el-footer {
  margin: 0;
  padding: 0;
}
</style>
