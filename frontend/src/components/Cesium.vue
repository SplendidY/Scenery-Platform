<template>
  <div>
    <div id="cesiumContainer"></div>
    <div id="service"></div>
  </div>
</template>

<script setup>

// import { init, route } from '../jses/init.js'
import { onBeforeMount, onMounted } from 'vue';
import { getCurrentPosition, getLongitude, getLatitude, getmap } from '../jses/location';

let viewer;
async function init() {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Y2U5MWRhOC0zYzdhLTRjMGItODkwNC02NzVmNGFmMTBkOWEiLCJpZCI6MjA1MjM5LCJpYXQiOjE3MTE2ODUwMjF9.RRfIFU8B-huDx7VQOLeAmMabtoIcIkA1m2SRaRYopUI';
  viewer = new Cesium.Viewer('cesiumContainer', {
    animation: false,
    timeline: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    geocoder: false,
    infoBox: false,
    selectionIndicator: false,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
    sceneMode: Cesium.SceneMode.SCENE3D
  });

  viewer.sceneModePicker.viewModel.duration = 0.0;
  viewer._cesiumWidget._creditContainer.style.display = "none";

  try {
    const position = await getCurrentPosition();
    console.log('定位成功:', position);
    setView(position.longitude, position.latitude);
    setHomeView(position.longitude, position.latitude);
  } catch (error) {
    console.error('定位失败:', error.message);
    setView(120, 30);
    setHomeView(120, 30);
  }
}
async function route() {
  const position = await getCurrentPosition();
  try {
  await drawRoute(position.longitude, position.latitude, 120, 30);
  }
  catch (error) {
    console.error('路线失败:',error.message);
  }
}

function setView(longitude, latitude) {
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 5000),
    orientation: {
      heading: Cesium.Math.toRadians(360),
      pitch: Cesium.Math.toRadians(-90),
      roll: Cesium.Math.toRadians(0)
    }
  });

  Cesium.CesiumTerrainProvider.fromIonAssetId(1, {
    requestWaterMask: true,
    requestVertexNormals: true,
  }).then((terrainProvider) => {
    viewer.terrainProvider = terrainProvider;
  }).catch((e) => {
    console.log(e);
  });

  var layer = new Cesium.UrlTemplateImageryProvider({
    url: "http://webrd02.is.autonavi.com/appmaptile?lang=en&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    minimumLevel: 4,
    maximumLevel: 18
  });

  viewer.imageryLayers.addImageryProvider(layer);
}

function setHomeView(longitude, latitude) {
  viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
    e.cancel = true;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 5000),
      orientation: {
        heading: Cesium.Math.toRadians(360),
        pitch: Cesium.Math.toRadians(-90),
        roll: Cesium.Math.toRadians(0)
      }
    });
  });
}

async function drawRoute(startLng, startLat, endLng, endLat) {
  const map = getmap();
  await new Promise((resolve, reject) => {
    AMap.plugin('AMap.Driving', function () {
      try {
        var driving = new AMap.Driving({
          map: map,
          panel: "service"
        });
        driving.search(new AMap.LngLat(startLng, startLat), new AMap.LngLat(endLng, endLat), function (status, result) {
          if (status === 'complete' && result.routes && result.routes.length > 0) {
            var path = result.routes[0].steps.reduce((acc, step) => {
              return acc.concat(step.path);
            }, []);
            var positions = path.map(point => {
              return Cesium.Cartesian3.fromDegrees(point.lng, point.lat);
            });
            viewer.entities.add({
              polyline: {
                positions: positions,
                width: 5,
                material: Cesium.Color.RED
              }
            });
            
            console.log('绘制驾车路线完成');
            resolve();
          } else {
            console.error('获取驾车数据失败:', result);
            reject(new Error('获取驾车数据失败'));
          }
        });
      } catch (e) {
        console.error('AMap.Driving error:', e);
        reject(e);
      }
    });
  });
}

function getViewer() {
  return viewer;
}

onBeforeMount(() => {
  console.log("a");
})

onMounted(() => {
  init();
  route();
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
  max-height: 500px;
  overflow-y: auto;
  background-color: white;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 10;
}
</style>
