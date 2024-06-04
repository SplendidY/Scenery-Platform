//location.js
let currentPosition = {
  longitude: null,
  latitude: null
};
var map;
//用ip获取当前位置
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 13
    });

    AMap.plugin('AMap.Geolocation', function() {
      var geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 10000,
        buttonPosition: 'RB',
        zoomToAccuracy: true,
      });

      map.addControl(geolocation);
      geolocation.getCurrentPosition(function(status, result) {
        if (status === 'complete') {
          currentPosition.longitude = result.position.lng;
          currentPosition.latitude = result.position.lat;
          resolve(currentPosition);
        } else {
          reject(new Error(result.message));
        }
      });
    });
  });
}

export function getLongitude() {
  return currentPosition.longitude;
}

export function getLatitude() {
  return currentPosition.latitude;
}

export function getmap() {
  return map;
}
