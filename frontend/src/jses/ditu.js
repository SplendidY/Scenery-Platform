import { getViewer } from './init'
function SwitchLayer(index) {
    const viewer = getViewer();
    if (index === '2-1') {
    viewer.imageryLayers.removeAll();
    const osmProvider = new Cesium.OpenStreetMapImageryProvider({
        url:"https://tile.openstreetmap.org/",
    });
    viewer.imageryLayers.addImageryProvider(osmProvider);
    
    console.log("b");
    }
    else if (index === '2-2') {
    viewer.imageryLayers.removeAll();
    var gaodeProvider = new Cesium.UrlTemplateImageryProvider({
        url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        credit: '高德地图',
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 18,
    });
    viewer.imageryLayers.addImageryProvider(gaodeProvider);
    }
    else if (index === '2-3') {
    viewer.imageryLayers.removeAll();
    viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=1780110dcac21ab0701cb693967a3e93",
        layer: "tdtBasicLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false,
    }));
    viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=1780110dcac21ab0701cb693967a3e93",
        layer: "tdtAnnoLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false,
    }));
    }
    else if (index === '2-4-1') {
    ///////
    } 
    else if (index === '2-4-2') {
    ///////
    } 
    else if (index === '2-4-3') {
    ///////
    }
}

export {
    SwitchLayer
}