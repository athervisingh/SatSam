import { useState, useEffect } from "react";
import { MapContainer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import TilesLayer from "../../components/tilesLayer/tilesLayer.components";
// import DrawControl from "../../components/drawControls/drawControls.component";
import SegmentButton from "../../components/button/segmentButton/segmentButton";
import ImageButton from "../../components/button/imageButton/imageButton.component";
// import MapUpdater from "../../components/mapUpdater/mapUpdater";
import MapControls from '../../components/mapControls/mapControls';
import { Toaster } from 'sonner';
import Loading from "../../components/Loading";
import { useSelector, useDispatch } from "react-redux";
import RegionOverLay from '../../components/overlays/regionOverlays.component'
import AuthPopup from "../authentication/AuthPopUp/AuthPopup";
import { addClassPolygon } from '../../store/Slices/ClassjsonSlice/classjsonSlice';
import { setMobileMode } from "../../store/Slices/AdditionalDetailsSlice/addDetailsSlice";
import SegmentDLButton from "../../components/button/dlModelButton/segmentDLButton";
import SetMapButton from '../../components/setMapButton/setMapbutton.component'
import SamButton from "../../components/button/sambtn/sambutton";
const MapPage = () => {
  const { drawControl, showImageButton } = useSelector((state) => state.buttonSlice);
  const { mapInstance, dropdownData } = useSelector((state) => state.dataSlice);
  const classJsonData = useSelector((state) => state.classjsonData);
  const [loading, setLoading] = useState(false); //classjsonSlice
  const geojsonData = useSelector((state) => state.geojsonData);
  const [authPop, setAuthPop] = useState(false);
  const dispatch = useDispatch();
  const {imageResponseSignal} = useSelector((state)=>state.addDetailsSlice);
  const [isMobileView, setIsMobileView] = useState(false);
  const {isLoading} = useSelector((state)=>state.buttonSlice);


  const checkWidth = () => {
    if (window.innerWidth <= 746) {
      setIsMobileView(true);
      dispatch(setMobileMode(true))
    } else {
      setIsMobileView(false);
      dispatch(setMobileMode(false))
    }
  };

  useEffect(() => {
    checkWidth(); // Check the initial window size
    window.addEventListener('resize', checkWidth); // Listen for window resize events

    return () => {
      window.removeEventListener('resize', checkWidth);
    };
  }, []);

  const [map, setMap] = useState(null);
  const [currentStyle, setCurrentStyle] = useState(
    "mapbox://styles/mapbox/satellite-streets-v12"
  );
  const [isGlobe, setIsGlobe] = useState(true);
  const geeimageurl = useSelector((state)=> state.dataSlice.geeimageurl);
  const addGeoJSONLayer = (mapInstance, geojsonData) => {
    if (!geojsonData.id) return;

    const layerId = geojsonData.id;
    if (!mapInstance.getSource(layerId)) {
      mapInstance.addSource(layerId, {
        type: 'geojson',
        data: geojsonData,
      });
      mapInstance.addLayer({
        id: layerId,
        type: 'fill',
        source: layerId,
        paint: {
          'fill-color': '#888', 
          'fill-opacity': 0.5, 
        },
      });

    }
  };


  useEffect(() => {
    if (geojsonData.length > 0) {
      addGeoJSONLayer(mapInstance, geojsonData[geojsonData.length - 1])
    }
    if(geojsonData.length > 1){
      console.log('geojson for class entered here')
      dispatch(addClassPolygon(geojsonData[geojsonData.length - 2]))
    }

  }, [geojsonData]);
  const {developerState} =useSelector((state) =>state.buttonSlice)
  
  return (
    <div className="h-[90vh] relative">
      <MapContainer
        center={[20.26, 76.2]}
        zoom={4}
        style={{ height: "92vh", width: "100%" }}
        doubleClickZoom={false}
        zoomControl={false}
      >

        {/* {loading && <Loading />} */}
        {/* {authPop && <AuthPopup handleClose={setAuthPop} />} */}

        <TilesLayer map={map} setMap={setMap} currentStyle={currentStyle} setCurrentStyle={setCurrentStyle} isGlobe={isGlobe} setIsGlobe={setIsGlobe} />
        {/* <TilesLayer/> */}
        {/* {drawControl && <DrawControl />} */}
        {/* {classJsonData.classjsonData.length > 0 && <SegmentButton /> } */}
        {/* {!imageResponseSignal && <ImageButton/>}
        {developerState===0 && imageResponseSignal && <SegmentDLButton/>}
        {developerState===2 && <SetMapButton/> } */}
{/* {developerState===2 && !imageResponseSignal && <SamButton/>} */}
<SamButton/>
        <RegionOverLay />
        {!isMobileView &&
        <MapControls setLoading={setLoading} setAuthPop={setAuthPop} map={map} isGlobe={isGlobe} setIsGlobe={setIsGlobe} setCurrentStyle={setCurrentStyle} />}
      </MapContainer>
      <Toaster position="top-center" expand={false} duration={2000} richColors />
    </div>
  );
};

export default MapPage;