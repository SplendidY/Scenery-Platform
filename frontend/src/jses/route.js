import { getCurrentPosition } from './location';
import CoordTransform from './CoordTransform';
import { getViewer } from './init';

async function route() {
    const viewer = getViewer();
    const position = await getCurrentPosition();
    try {
      await drawRoute(position.longitude, position.latitude, 100.3, 30.3);
    } catch (error) {
      console.error('路线失败:', error.message);
    }
  }

  async function drawRoute(startLng, startLat, endLng, endLat) {
    const viewer = getViewer();
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

export {
    route
}