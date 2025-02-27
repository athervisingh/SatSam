import React, { useCallback } from "react";
import { Globe, Map } from 'lucide-react';
import { useDispatch } from "react-redux";
import { clearAll } from "../../../store/Slices/GeojsonSlice/geojsonSlice";

const MAP_SETS = {
  threeD: [
    { name: "AWiFS", image: "/3d-satellite.png", layer: "mapbox://styles/mapbox/satellite-streets-v11" },
    { name: "Sentinel", image: "/3d-standard.png", layer: "mapbox://styles/mapbox/streets-v11" },
    { name: "LISS4", image: "/3d-outdoor.png", layer: "mapbox://styles/mapbox/outdoors-v11" },
    { name: "Tintoda", image: "/3d-light.png", layer: "mapbox://styles/mapbox/light-v10" },
    // { name: "Dark Mode", image: "/3d-dark.png", layer: "mapbox://styles/mapbox/dark-v10" },
  ],
  twoD: [
    { name: "Satellite Mode", image: "/2d-satellite.png", layer: "mapbox://styles/mapbox/satellite-streets-v11" },
    { name: "Standard Mode", image: "/2d-standard.png", layer: "mapbox://styles/mapbox/streets-v11" },
    { name: "Outdoor Mode", image: "/2d-outdoor.png", layer: "mapbox://styles/mapbox/outdoors-v11" },
    { name: "Light Mode", image: "/2d-light.png", layer: "mapbox://styles/mapbox/light-v10" },
    { name: "Dark Mode", image: "/2d-dark.png", layer: "mapbox://styles/mapbox/dark-v10" },
  ],
};

const MapBoxControlButtons = ({ map, isGlobe, setIsGlobe, setCurrentStyle }) => {
  const currentSet = isGlobe ? MAP_SETS.threeD : MAP_SETS.twoD;
  const dispatch = useDispatch();

  const toggleProjection = useCallback(() => {
    if (map) {
      const projection = isGlobe ? "mercator" : "globe";
      map.setProjection(projection);
      setIsGlobe((prev) => !prev);
      dispatch(clearAll());
    }
  }, [map, isGlobe, setIsGlobe, dispatch]);

  const changeLayer = useCallback(
    (styleUrl) => {
      if (map) {
        map.setStyle(styleUrl);
        setCurrentStyle(styleUrl);
        if (!isGlobe) {
          map.setProjection("globe");
          setIsGlobe(true);
        }
        dispatch(clearAll());
      }
    },
    [map, setCurrentStyle, dispatch, isGlobe, setIsGlobe]
  );

  if (!map) return null;

  return (
    <div className="z-10">
      <div className="bg-opacity-50 flex items-center justify-center overflow-x-hidden">
        <div className="text-white rounded-lg w-80 max-h-[79vh] overflow-y-auto scrollbar-custom">
          {/* Map Dimension Toggle */}
          {/* <div className="mb-6 w-[95%]">
            <h3 className="text-lg font-semibold mb-2 text-gray-200">Map Dimension</h3>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isGlobe}
                  onChange={toggleProjection}
                />
                <div className="w-14 h-7 bg-gray-400 rounded-full transition-colors duration-300 ease-in-out"></div>
                <div className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ease-in-out ${isGlobe ? 'transform translate-x-7' : ''}`}></div>
              </div>
              <div className="ml-3 flex items-center">
                {isGlobe ? <Globe size={20} className="mr-2" /> : <Map size={20} className="mr-2" />}
                <span>{isGlobe ? "3D Globe" : "2D Map"}</span>
              </div>
            </label>
          </div> */}

          {/* Map Styles */}
          <div className="w-[95%]">
            <h3 className="text-lg font-semibold mb-2 text-gray-200">Map Styles</h3>
            <div className="space-y-3">
              {currentSet.map((layer, index) => (
                <button
                  key={index}
                  onClick={() => changeLayer(layer.layer)}
                  className="w-full text-left rounded-lg overflow-hidden relative transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="relative h-16 group">
                    <img
                      src={layer.image}
                      alt={layer.name}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                    <div className="absolute bottom-2 left-2 text-white font-semibold">{layer.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapBoxControlButtons;

