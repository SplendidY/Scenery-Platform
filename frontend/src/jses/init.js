import { getCurrentPosition } from './location';
import {
  WebMercatorProjection,
  WebMercatorTilingScheme,
  Math as CesiumMath,
  Cartographic,
  Cartesian2,
} from 'cesium';
import CoordTransform from './CoordTransform';

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
  getViewer,init,route
}