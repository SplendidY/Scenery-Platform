//init.js
import { getCurrentPosition } from './location.js';
import { isDrawing } from '../components/Service.vue';
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
    setView(120.5, 29.5);
    setHomeView(120.5, 29.5);
  }
   addClickHandler();
 }

let pointsArray = [];
let polyline = undefined;

function addClickHandler() {
  isDrawing()}

export function stratDrawing(){
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  
  // 处理左键点击，继续添加点
  handler.setInputAction((movement) => {
    isDrawing()
      const cartesian = viewer.camera.pickEllipsoid(movement.position);
      if (cartesian) {
          addPoint(cartesian);
      }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // 处理右键点击，结束多边形的绘制
  handler.setInputAction(() => {
      endDrawing(handler);
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

}

  
  function addPoint(cartesian) {
    viewer.entities.add({
        position: cartesian,
        point: {
            pixelSize: 10,
            color: Cesium.Color.RED
        }
    });
    pointsArray.push(cartesian);
    updateShape();
}

function updateShape() {
  if (pointsArray.length === 2) {
      // 有两个点时，绘制线
      polyline = viewer.entities.add({
          polyline: {
              positions: pointsArray,
              width: 5,
              material: Cesium.Color.RED
          }
      });
  } else if (pointsArray.length > 2) {
      // 更新多边形或线
      if (polyline) {
          viewer.entities.remove(polyline);
      }
      polyline = viewer.entities.add({
          polyline: {
              positions: pointsArray.concat([pointsArray[0]]), // 闭合多边形
              width: 5,
              material: Cesium.Color.RED
          }
      });
  }
}

 export function endDrawing(handler) {
  if (polyline) {
      viewer.entities.add({
          polygon: {
              hierarchy: new Cesium.PolygonHierarchy(pointsArray),
              material: Cesium.Color.YELLOW.withAlpha(0.7)
          }
      });
      viewer.entities.remove(polyline); // 移除临时线条
  }
  handler.destroy(); // 移除事件监听，结束绘制
  pointsArray = []; // 可选：清空点数组，准备下一次绘制
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
    url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
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

function getViewer() {
  return viewer;
}

export {
  init,
  getViewer
}