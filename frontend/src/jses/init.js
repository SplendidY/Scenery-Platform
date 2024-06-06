//init.js
import { getCurrentPosition } from './location';
import {
  WebMercatorProjection,
  WebMercatorTilingScheme,
  Math as CesiumMath,
  Cartographic,
  Cartesian2,
} from 'cesium';
import CoordTransform from './CoordTransform';
//全局变量viewer
let viewer;
//坐标转换

//初始化cesium球
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
    sceneMode: Cesium.SceneMode.SCENE3D,
  });

  viewer.sceneModePicker.viewModel.duration = 0.0;
  viewer._cesiumWidget._creditContainer.style.display = 'none';

const imageryProvider = new Cesium.UrlTemplateImageryProvider({
  url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
  tilingScheme: new Cesium.WebMercatorTilingScheme(),
});

viewer.imageryLayers.addImageryProvider(imageryProvider);


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

function setView(longitude, latitude) {
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 5000),
    orientation: {
      heading: CesiumMath.toRadians(360),
      pitch: CesiumMath.toRadians(-90),
      roll: CesiumMath.toRadians(0),
    },
  });
}

function setHomeView(longitude, latitude) {
  viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
    e.cancel = true;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 5000),
      orientation: {
        heading: CesiumMath.toRadians(360),
        pitch: CesiumMath.toRadians(-90),
        roll: CesiumMath.toRadians(0),
      },
    });
  });
}

function getViewer() {
  return viewer;
}

export {
  getViewer,init
}