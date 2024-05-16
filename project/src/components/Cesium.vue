<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import { onBeforeMount, onMounted } from 'vue';
import {init} from '../jses/init.js'
onBeforeMount(() => {
      console.log("a");
    })
onMounted(() => {
  init();
    });
</script>
    
<style>
#cesiumContainer {
  height:100%;
  position: absolute;
  left: 0 ;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>