import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { setMapInstance } from "../../store/Slices/DataSlice/dataSlice";
import extendDrawBar from "../extend_bar";
import DrawRectangle from "../DrawRectangle";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useDispatch, useSelector } from "react-redux";
import OpacitySlider from "../mapControls/Controls/Opacity/opacitySlider.component";
import { clearAll } from "../../store/Slices/GeojsonSlice/geojsonSlice";

const TilesLayer = ({ map, setMap, currentStyle }) => {
  const dispatch = useDispatch();
  const { geeImageUrl, geeAccessToken } = useSelector(
    (state) => state.dataSlice
  );
  const {developerState} = useSelector((state)=>state.buttonSlice)
  const buttons = useSelector((state) => state.buttonSlice);
  const { dropdownData } = useSelector((state) => state.dataSlice);
  const {maskResponseSignal} = useSelector((state)=>state.addDetailsSlice)
  const MAP_BOX =
    "pk.eyJ1Ijoia2hhbGVlcXVlNTYiLCJhIjoiY200NXphMDg2MHZzODJxc2Jha3F5N3VnYiJ9.oEzy-505dRBcBamWC6QOqA";
  const ACCESS_TOKEN =
    "pk.eyJ1Ijoic3ZjLW9rdGEtbWFwYm94LXN0YWZmLWFjY2VzcyIsImEiOiJjbG5sMnExa3kxNTJtMmtsODJld24yNGJlIn0.RQ4CHchAYPJQZSiUJ0O3VQ";

  useEffect(() => {
    mapboxgl.accessToken = MAP_BOX;

    let zoom = 4, lat = 76.2, lon = 20.26;
    try {
      const mapFragment = window.location.hash.split("#map=")[1];
      if (mapFragment) {
        const parts = mapFragment.split("/");
        zoom = parseFloat(parts[0]) || 4;
        lat = parseFloat(parts[1]) || 76.2;
        lon = parseFloat(parts[2]) || 20.26;
      }
    } catch {
      console.log("Initializing default map settings.");
    }

    const mapInstance = new mapboxgl.Map({
      container: "map",
      style: currentStyle,
      center: [lat, lon],
      zoom,
      projection: "globe",
      hash: "map",
    });

    mapInstance.addControl(
      new MapboxGeocoder({
        accessToken: ACCESS_TOKEN,
        mapboxgl,
        marker: true,
      })
    );
    
    const geeTileUrl = `${geeImageUrl}?access_token=${geeAccessToken}`;

    
    mapInstance.on("load", () => {
      mapInstance.addControl(new mapboxgl.ScaleControl())
      mapInstance.setFog({
        range: [0.1, 0.9],
        color: "rgb(0, 0, 0)",
        "horizon-blend": 0.02,
      });

      if (geeImageUrl !== null && geeAccessToken!== null) {
        mapInstance.addSource("custom-overlay", {
          type: "raster",
          tiles: [geeTileUrl],
          tileSize: 256,
        });
  
        mapInstance.addLayer({
          id: "custom-overlay-layer",
          type: "raster",
          source: "custom-overlay",
          paint: {
            "raster-opacity": 1,
          },
        });
      }
    });

    mapInstance.addControl(new mapboxgl.NavigationControl());
    mapInstance.addControl(new mapboxgl.ScaleControl());

    setMap(mapInstance);
    dispatch(setMapInstance(mapInstance));

    return () => {
      if (mapInstance && typeof mapInstance.remove === 'function') {
        mapInstance.remove(); // Cleanup on unmount
      }
    };
  }, [currentStyle, setMap, dispatch, geeImageUrl, geeAccessToken]);

 const geojsonData = useSelector((state)=>state.geojsonData)

 const updateCanvasOpacity = (className, opacity) => {
  const layerId = `${className}-canvas-layer`;
  if (map && map.getLayer && map.getLayer(layerId)) {
      map.setPaintProperty(layerId, "raster-opacity", opacity);
      console.log(`Opacity for ${className}Canvas updated to ${opacity}`);
  } else {
      console.warn(`Layer ${layerId} does not exist.`);
  }
};

  useEffect(() => {
    let drawControl = null;
    
    if (map && typeof map.addControl === 'function') {
      const modes = MapboxDraw.modes;
      if(geojsonData.geojsonData.length === 0 ){
        modes.draw_rectangle_roi = DrawRectangle(dispatch, true);
      }else{
        modes.draw_rectangle_class = DrawRectangle(dispatch, false);
      }

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          draw_rectangle_roi: DrawRectangle,
          draw_rectangle_class: DrawRectangle,
          direct_select: MapboxDraw.modes.direct_select,
        },
        modes: modes,
      });
      
      drawControl = new extendDrawBar({
        draw: draw,
        buttons: [
          (geojsonData.geojsonData.length === 0 ? 
          {
            on: "click",
            action: () => {
              draw.changeMode("draw_rectangle_roi");
            },
            classes: [
              "mapbox-gl-draw_ctrl-draw-btn",
              "mapbox-gl-draw_rectangle",
            ],
            title: "Draw Rectangle for ROI",
          }:
          {
            on: "click",
            action: () => {
              draw.changeMode("draw_rectangle_class");
            },
            classes: [
              "mapbox-gl-draw_ctrl-draw-btn",
              "mapbox-gl-draw_rectangle",
            ],
            title: "Draw Rectangle for Class",
          })
        ],
      }); 
      
      map.addControl(drawControl);
    }

    return () => {
      // Safe cleanup of the draw control
      if (map && drawControl && typeof map.removeControl === 'function') {
        try {
          map.removeControl(drawControl);
        } catch (error) {
          console.warn("Error removing draw control:", error);
        }
      }
    };
  }, [map, dispatch, geojsonData.geojsonData]);

  return (<div id="map" style={{ width: "100%", height: "100vh" }}>
    { maskResponseSignal && developerState === 1 &&
    <OpacitySlider updateCanvasOpacity={updateCanvasOpacity} />
    }
  </div>);
};

export default TilesLayer;