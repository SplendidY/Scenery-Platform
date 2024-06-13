<template>
  <div>
    <div id="cesiumContainer"></div>
    <div id="service"></div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted } from 'vue';
import { init,getViewer } from '../jses/init'
import { route } from '../jses/route'

onBeforeMount(() => {
  console.log('a');
});

onMounted(() => {
  var panel = document.getElementById("service");
  panel.style.display = "none";
  init();
});

</script>

<style>
#cesiumContainer {
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

#service {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  background-color: white;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 10;
}
</style>
