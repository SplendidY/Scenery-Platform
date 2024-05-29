<template>
  <div>
    <div id="cesiumContainer"></div>
    <div id="service"></div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted } from 'vue';
import { getCurrentPosition } from '../jses/location';
import {
  WebMercatorProjection,
  WebMercatorTilingScheme,
  Math as CesiumMath,
  Cartographic,
  Cartesian2,
} from 'cesium';
import CoordTransform from '../jses/CoordTransform';

let viewer;

class AmapMercatorTilingScheme extends WebMercatorTilingScheme {
  constructor() {
    super();
    const projection = new WebMercatorProjection();

    this._projection.project = function (cartographic, result) {
      result = CoordTransform.WGS84ToGCJ02(
        CesiumMath.toDegrees(cartographic.longitude),
        CesiumMath.toDegrees(cartographic.latitude)
      );
      result = projection.project(
        new Cartographic(
          CesiumMath.toRadians(result[0]),
          CesiumMath.toRadians(result[1])
        )
      );
      return new Cartesian2(result.x, result.y);
    };

    this._projection.unproject = function (cartesian, result) {
      const cartographic = projection.unproject(cartesian);
      result = CoordTransform.GCJ02ToWGS84(
        CesiumMath.toDegrees(cartographic.longitude),
        CesiumMath.toDegrees(cartographic.latitude)
      );
      return new Cartographic(
        CesiumMath.toRadians(result[0]),
        CesiumMath.toRadians(result[1])
      );
    };
  }
}

async function init() {
  Cesium.Ion.defaultAccessToken = 'your-cesium-ion-token';
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
    url: 'https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
    minimumLevel: 3,
    maximumLevel: 18,
    tilingScheme: new AmapMercatorTilingScheme(),
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

async function route() {
  const position = await getCurrentPosition();
  try {
    await drawRoute(position.longitude, position.latitude, 100.3, 30.3);
  } catch (error) {
    console.error('路线失败:', error.message);
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

async function drawRoute(startLng, startLat, endLng, endLat) {
  const routeCoordinates = await getAMapDrivingRoute(startLng, startLat, endLng, endLat);

  const positions = routeCoordinates.map((coord) => {
    const wgsCoord = CoordTransform.GCJ02ToWGS84(coord[0], coord[1]);
    return Cesium.Cartesian3.fromDegrees(wgsCoord[0], wgsCoord[1]);
  });

  viewer.entities.add({
  polyline: {
    positions: positions,
    width: 10,
    material: new Cesium.PolylineGlowMaterialProperty({
      glowPower: 0.4,
      color: Cesium.Color.GREEN, // Change color to green
    }),
  },
});
}

async function getAMapDrivingRoute(startLng, startLat, endLng, endLat) {
  return new Promise((resolve, reject) => {
    AMap.plugin('AMap.Driving', function () {
      try {
        const driving = new AMap.Driving({
          map: null,
          panel: 'service'
        });
        driving.search(
          new AMap.LngLat(startLng, startLat),
          new AMap.LngLat(endLng, endLat),
          function (status, result) {
            if (status === 'complete' && result.routes && result.routes.length > 0) {
              const steps = result.routes[0].steps;
              const coordinates = steps.flatMap((step) =>
                step.path.map((point) => [point.lng, point.lat])
              );
              resolve(coordinates);
            } else {
              reject(new Error('Failed to get driving route'));
            }
          }
        );
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
  console.log('a');
});

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
