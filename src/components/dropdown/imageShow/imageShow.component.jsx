import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
const ImageShow = ({ tileLayerUrl, token }) => {
    const MAP_API_KEY = import.meta.env.VITE_MAP_API_KEY;
    const url = tileLayerUrl;
    const tile = url.replace("{token}", token);
  return (
    <MapContainer
      center={[0,0]}
      zoom={3}
      style={{ height: "100vh", width: "100%" }}
    >
      <LayersControl position="topright">
        {/* Satellite Map Layer */}
        <LayersControl.BaseLayer checked name="Satellite Map">
          {tileLayerUrl && token ? (
            <TileLayer
              url={`${tile}`}
              attribution="&copy; <a href='https://earthengine.google.com'>Google Earth Engine</a>"
            />
          ) : (
            <TileLayer
              url={`https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${MAP_API_KEY}`}
            />
          )}
        </LayersControl.BaseLayer>
      </LayersControl>
    </MapContainer>
  );
};

export default ImageShow;
