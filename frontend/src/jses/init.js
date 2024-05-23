let viewer;

function init() {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Y2U5MWRhOC0zYzdhLTRjMGItODkwNC02NzVmNGFmMTBkOWEiLCJpZCI6MjA1MjM5LCJpYXQiOjE3MTE2ODUwMjF9.RRfIFU8B-huDx7VQOLeAmMabtoIcIkA1m2SRaRYopUI';
  viewer = new Cesium.Viewer('cesiumContainer',{
  animation: false,
  timeline: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  infoBox: false,
  sceneModePicker: false,
  selectionIndicator: false,
  navigationHelpButton: false,
  navigationInstructionsInitiallyVisible: false,
  sceneMode: Cesium.SceneMode.SCENE3D
});
  viewer._cesiumWidget._creditContainer.style.display = "none";
  // window.viewer = viewer;
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(119.5, 29.3, 600000),
    orientation: {
        heading: Cesium.Math.toRadians(360),
        pitch: Cesium.Math.toRadians(-90),
        roll: Cesium.Math.toRadians(0)
    }});
  Cesium.CesiumTerrainProvider.fromIonAssetId(1, {
    requestWaterMask:true,
    requestVertexNormals:true,
  }).then((terrainProvider) => {
    viewer.terrainProvider = terrainProvider;
  }).catch((e) => {
    console.log(e);
  });  
  var gaodeProvider = new Cesium.UrlTemplateImageryProvider({
    url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    credit: '高德地图',
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 18,
  });
  viewer.imageryLayers.addImageryProvider(gaodeProvider);
  // provide('viewer', viewer);
}
function getViewer() {
  return viewer;
}
export {
    init,
    getViewer
}