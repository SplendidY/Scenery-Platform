//location.js
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    var map = new AMap.Map('container', {
      resizeEnable: true
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
          resolve({
            longitude: result.position.lng,
            latitude: result.position.lat
          });
        } else {
          reject(new Error(result.message));
        }
      });
    });
  });
}
