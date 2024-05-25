import { getCurrentPosition } from './location.js';

let viewer;

async function init() {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Y2U5MWRhOC0zYzdhLTRjMGItODkwNC02NzVmNGFmMTBkOWEiLCJpZCI6MjA1MjM5LCJpYXQiOjE3MTE2ODUwMjF9.RRfIFU8B-huDx7VQOLeAmMabtoIcIkA1m2SRaRYopUI';
  viewer = new Cesium.Viewer('cesiumContainer', {
    animation: false,
    timeline: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
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
  } catch (error) {
    console.error('定位失败:', error.message);
    setView(120.5, 29.5);
  }
}

function setView(longitude, latitude) {
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 6000),
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
    url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    minimumLevel: 4,
    maximumLevel: 18
  });

  viewer.imageryLayers.addImageryProvider(layer);
}

function getViewer() {
  return viewer;
}

export {
  init,
  getViewer
}
