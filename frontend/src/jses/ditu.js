//ditu.js
import { getViewer } from './init'
function SwitchLayer(index) {
    const viewer = getViewer();
    if (index === '1-1-1') {
        console.log('a');
        viewer.imageryLayers.removeAll();
        const osmProvider1 = new Cesium.OpenStreetMapImageryProvider({
            url:"https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
            tilingScheme: new Cesium.WebMercatorTilingScheme(),
        });
        viewer.imageryLayers.addImageryProvider(osmProvider1);
    }
    else if (index === '1-1-2') {
        viewer.imageryLayers.removeAll();
        const osmProvider2 = new Cesium.OpenStreetMapImageryProvider({
            url:"http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        });
        viewer.imageryLayers.addImageryProvider(osmProvider2);
    }
    else if (index === '1-1-3') {
        viewer.imageryLayers.removeAll();
        const osmProvider3 = new Cesium.OpenStreetMapImageryProvider({
            url:"http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        });
        viewer.imageryLayers.addImageryProvider(osmProvider3);
    }
    else if (index === '1-2') {
        viewer.imageryLayers.removeAll();
        var gaodeProvider = new Cesium.UrlTemplateImageryProvider({
            url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
            minimumLevel: 4,
            maximumLevel: 18
        })
        viewer.imageryLayers.addImageryProvider(gaodeProvider);
    }
    else if (index === '1-3') {
        viewer.imageryLayers.removeAll();
        var provider = new Cesium.WebMapServiceImageryProvider({
            url:'http://localhost:8080/geoserver/ne/wms',
            layers:'ne:countries',
            parameters:{
              service: 'WMS',
              format:'image/png',
              transparent: true,
            }
          });
          viewer.imageryLayers.addImageryProvider(provider);
    }
}

export {
    SwitchLayer
}