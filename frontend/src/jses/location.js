export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    var map = new AMap.Map('container', {
      resizeEnable: true
    });

    AMap.plugin('AMap.Geolocation', function() {
      var geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 10000,          // 超过10秒后停止定位，默认：5s
        buttonPosition: 'RB',    // 定位按钮的停靠位置
        buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true,   // 定位成功后是否自动调整地图视野到定位点
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
