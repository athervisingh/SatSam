import React, { useState ,useEffect} from "react";
import {
  Navigation,
  Globe,
  Share2,
  MapPinned,
  HelpCircle,
  X,
  Braces,
  SlidersHorizontal,
  Layers 
} from "lucide-react";
import ShareContent from "./Controls/share.component";
import MLModelComponent from "./Controls/settings.component";
import CommunityComp from "./Controls/community.component";
import GeoJSONTabManager from "./Controls/geojson.component";
import MarkerManager from "./Controls/marker.component";
import { useSelector } from "react-redux";
import { showMyLocation } from "../../Utility/ShowMyLocation";
// import DeveloperSwitch from "../developerSwitch/DeveloperSwitch";
import MapBoxControls from "./Controls/mapboxcontrols.component";
import MapBoxControlButtons from "./Controls/mapboxcontrols.component";


const MapControls = ({ setLoading , setAuthPop, map, isGlobe, setIsGlobe, setCurrentStyle}) => {
  const {mapInstance} = useSelector((state)=> state.dataSlice)
  const [activePanel, setActivePanel] = useState(null);
  // const map = useMap(); // Get the map instance


  const {developerState} =useSelector((state) =>state.buttonSlice)
  let controls= null;
  
  const baseControls = [
    { icon: Navigation, label: "Show My Location", panel: "navigation" },
    // { icon: Globe, label: "Community", panel: "community" },
    // { icon: Braces, label: "Geo Json", panel: "geojson" },
    { icon: SlidersHorizontal, label: "Setting", panel: "share" },
    // { icon: HelpCircle, label: "Help", panel: "help" },
    { icon: Layers, label: "Layers", panel: "layer" },
  ];
  
  const developerControls = [
    { icon: Navigation, label: "Show My Location", panel: "navigation" },
    { icon: Globe, label: "Community", panel: "community" },
    { icon: Braces, label: "Geo Json", panel: "geojson" },
    { icon: SlidersHorizontal, label: "Settings", panel: "settings" },
    { icon: Share2, label: "Share", panel: "share" },
    { icon: HelpCircle, label: "Help", panel: "help" },
    { icon: Layers, label: "Layers", panel: "layer" },
  ];
  const isMobileView = useSelector((state) => state.addDetailsSlice.mobileMode)

  if(developerState === 0 ){
    controls= baseControls;
  }else{
    controls = developerControls;
  }
  
  const handleControlClick = (control) => {
    if (control.panel === "navigation") {
      showMyLocation(mapInstance, setLoading);
      setActivePanel(null);
    } else {
      setActivePanel(activePanel === control.panel ? null : control.panel);
    }
  };

 

  return (
    <div className={`absolute right-0 top-0 flex justify-between  ${activePanel? 'h-full':'h-0' } `}
    
    >
      {/* Sidebar */}
      <div
        className={`h-full w-72 bg-bg-color shadow-lg transform transition-transform duration-300 ${
          activePanel ? "translate-x-0" : "translate-x-full "
        }`}
        
      >
        <div className="flex items-center justify-between border-b px-4 py-3 text-white">
          <h1 className="text-lg font-semibold capitalize">
            {activePanel || ""}
          </h1>
          <button
            className="p-2 rounded hover:bg-gray-600"
            onClick={() => setActivePanel(null)}
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
        <div className="p-4 text-white">
          {activePanel === "share" && <ShareContent />}
          {activePanel === "settings" && <MLModelComponent mapInstance={mapInstance} />}
          {activePanel === "geojson" && <GeoJSONTabManager />}
          {activePanel === "community" && <CommunityComp setAuthPop={setAuthPop} />}
          {activePanel === "layer" && <MapBoxControlButtons map={map} isGlobe={isGlobe} setIsGlobe={setIsGlobe} setCurrentStyle={setCurrentStyle} />}
        </div>
      </div>

      {/* Controls */}
      <div
        className={`fixed top-[54px] right-0 flex flex-col gap-2 p-2 bg-bg-color shadow-lg transition-transform duration-300 ${
          activePanel ? "-translate-x-72" : "translate-x-0"
        }`}
      >
        {/* {<DeveloperSwitch setAuthPop={setAuthPop} setActivePanel={setActivePanel} isMobileView={isMobileView} />} */}
        {controls.map((control) => (
          <button
            key={control.label}
            title={control.label}
            onClick={() => handleControlClick(control)}
            className={`flex items-center justify-center h-10 w-10 rounded-lg bg-gray-700 hover:bg-gray-600 ${
              activePanel === control.panel ? "!bg-button-select-color" : ""
            }`}
          >
            <control.icon className="h-5 w-5 text-white" />
            <span className="sr-only">{control.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MapControls;