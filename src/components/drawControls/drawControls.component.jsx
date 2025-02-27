import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import Leaf from "leaflet";
import "leaflet-draw";
import { useDispatch, useSelector } from 'react-redux';
import { setGeojson } from "../../store/geojson/geojsonReducer";
import { addGeoJsonData, getLayers, onSelectionClick } from "../../store/Slices/DataSlice/dataSlice";
import { changeButton } from "../../store/Slices/ButtonSlice/buttonSlice";


const DrawControl = () => {
  const map = useMap();
  const dispatch = useDispatch();
  const { dropdownData, geoJsonData } = useSelector((state) => state.dataSlice);
  window.type = true;

  const ROISelection = dropdownData[0]?.selection;
  const classSelection = dropdownData[1]?.selection;
  const ROISelectionName = dropdownData[0]?.name;
  const classSelectionName = dropdownData[1]?.name;

  useEffect(() => {
    const drawnItems = new Leaf.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new Leaf.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polygon: false,
        polyline: false,
        rectangle: false,
        marker: false,
        circle: false,
        circlemarker: false,
      },
    });

    map.addControl(drawControl);

    const onCreate = (event) => {
      const layer = event.layer;
      drawnItems.addLayer(layer);
      const geojson = layer.toGeoJSON();
      const storedData = JSON.parse(localStorage.getItem('roi_data'));

      // console.log(ROISelection, classSelection);

      if (ROISelection && !classSelection) {
        geojson["properties"]['roi'] = ROISelectionName;
        geojson["properties"]['fill'] = storedData[ROISelectionName];

        // console.log("name", ROISelectionName)

        layer.setStyle({
          fillColor: storedData[ROISelectionName],
          fillOpacity: 0.5,
          color: '#000',
          weight: 1
        });

        dispatch(addGeoJsonData({ payload: geojson }));
        // console.log("drawControl , geojson" , geoJsonData);
        getLayers([drawnItems, layer]);
        dispatch(getLayers([drawnItems, layer]));
        dispatch(changeButton({ type: "drawControl", payload: false }));
        dispatch(changeButton({ type: "imageButtonDisabled", payload: false }));
        dispatch(changeButton({ type: "enableROI", payload: false }));

      } else if (classSelection && classSelection !== "-1" && ROISelection && ROISelection !== "-1") {
        geojson["properties"]['class'] = classSelectionName;
        geojson["properties"]['fill'] = classSelection;

        layer.setStyle({
          fillColor: classSelection,
          fillOpacity: 0.5,
          color: '#000',
          weight: 1
        });

        dispatch(addGeoJsonData({ payload: geojson }));
        dispatch(getLayers([drawnItems, layer]));
        dispatch(changeButton({ type: "drawControl", payload: false }));
        dispatch(changeButton({ type: "segmentButtonDisabled", payload: false }));
      }

      dispatch(changeButton({ type: "enableROI", payload: false }));

      if (layer && ROISelection && ROISelection !== "-1" && !classSelection) {
        const bounds = layer.getBounds();
        dispatch(onSelectionClick([
          [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
          [bounds.getNorthEast().lat, bounds.getNorthEast().lng]
        ]))
      }
    };

    map.on(Leaf.Draw.Event.CREATED, onCreate);

    return () => {
      map.off(Leaf.Draw.Event.CREATED, onCreate);
      map.removeControl(drawControl);
    };
  }, [map, ROISelection, classSelection, geoJsonData]);

  return null;
};

export default DrawControl;
