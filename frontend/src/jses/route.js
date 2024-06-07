import { getCurrentPosition } from './location';
import CoordTransform from './CoordTransform';
import { getViewer } from './init';
import store from './store';

let previousRouteEntity = null;
//路径规划函数
async function route() {
  const viewer = getViewer();
  const endj = store.state.endj;
  const endw = store.state.endw;
  const position = await getCurrentPosition();
  try {
    await drawRoute(position.longitude, position.latitude, endj, endw);
  } catch (error) {
    console.error('路线失败:', error.message);
  }
}
//将路径显示在Cesium球上
async function drawRoute(startLng, startLat, endLng, endLat) {
  const viewer = getViewer();
  const routeCoordinates = await getAMapDrivingRoute(startLng, startLat, endLng, endLat);

  const positions = routeCoordinates.map((coord) => {
    const wgsCoord = CoordTransform.GCJ02ToWGS84(coord[0], coord[1]);
    return Cesium.Cartesian3.fromDegrees(wgsCoord[0], wgsCoord[1]);
  });

  if (previousRouteEntity) {
    viewer.entities.remove(previousRouteEntity);
  }

  previousRouteEntity = viewer.entities.add({
    polyline: {
      positions: positions,
      width: 10,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.4,
        color: Cesium.Color.GREEN,
      }),
    },
  });

  const boundingSphere = Cesium.BoundingSphere.fromPoints(positions);

  viewer.camera.flyToBoundingSphere(boundingSphere, {
    duration: 2,
    offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90), (boundingSphere.radius)*5)
  });
}

var driving;
//高德api获取路径
async function getAMapDrivingRoute(startLng, startLat, endLng, endLat) {
  return new Promise((resolve, reject) => {
    AMap.plugin('AMap.Driving', function () {
      try {
        driving = new AMap.Driving({
          map: null,
          panel: 'service',//这个service指的是右上角的路线表格而不是service.vue
          autoFitView: true,
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

export {
  route,
}
