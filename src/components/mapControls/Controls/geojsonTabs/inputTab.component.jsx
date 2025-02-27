import React, { useState, useRef, useEffect } from "react";
import { Copy, FolderInput, Pencil, Save, X } from "lucide-react";
import '../../mapControls.css';
import { toast } from 'sonner';
import { useDispatch, useSelector } from "react-redux";
import { updatePolygon } from "../../../../store/Slices/GeojsonSlice/geojsonSlice";

const InputTab = () => {
  const geojsonData = useSelector((state) => state.geojsonData.geojsonData);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(geojsonData);
  const [editableData, setEditableData] = useState('');
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const { mapInstance } = useSelector((state) => state.dataSlice);

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
    } else {
      mapInstance.getSource(layerId).setData(geojsonData);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".geojson")) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target.result);
          if (parsedData.type === "FeatureCollection") {
            setOriginalData(parsedData);
            setEditableData(JSON.stringify(parsedData, null, 2));
            dispatch(updatePolygon(parsedData));
            addGeoJSONLayer(mapInstance, parsedData);
          } else {
            throw new Error("Invalid GeoJSON format.");
          }
        } catch (error) {
          toast.error('Invalid GeoJSON file!');
        }
      };

      reader.onerror = () => {
        toast.error('Error reading the file. Please try again.');
      };

      reader.readAsText(selectedFile);
    } else {
      toast.error('Please upload a valid .geojson file.');
    }
  };

  useEffect(() => {
    if (geojsonData) {
      const features = geojsonData.map((polygon) => ({
        type: "Feature",
        properties: {},
        geometry: {
          coordinates: [polygon.geometry.coordinates[0]],
          type: "Polygon",
        },
      }));

      const geoJsonString = JSON.stringify(
        {
          type: "FeatureCollection",
          features,
        },
        null,
        2
      );

      setEditableData(geoJsonString);
    }
  }, [geojsonData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(geojsonData, null, 2)).then(
      () => toast.success('Data copied to clipboard!'),
      () => toast.error('Failed to copy data.')
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditableData(JSON.stringify(geojsonData, null, 2));
  };

  const handleSave = () => {
    try {
      const parsedData = JSON.parse(editableData);
      if (parsedData.type === "FeatureCollection") {
        dispatch(updatePolygon(parsedData));
        setOriginalData(parsedData);
        setIsEditing(false);
        addGeoJSONLayer(mapInstance, parsedData);
        toast.success('Changes saved successfully!');
      } else {
        throw new Error("Invalid GeoJSON format.");
      }
    } catch (error) {
      toast.error("Invalid GeoJSON format. Please correct the changes.");
    }
  };

  const handleCancel = () => {
    setEditableData(JSON.stringify(originalData, null, 2));
    setIsEditing(false);
  };

  const renderWithLineNumbers = (text) => {
    return text.split("\n").map((line, index) => (
      <div key={index} className="flex">
        <span className="text-gray-400 w-8 text-right pr-2">{index + 1}</span>
        <pre className="flex-1 whitespace-pre-wrap">{line}</pre>
      </div>
    ));
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="rounded-lg bg-bg-color">
      <div className="flex justify-between items-center mb-4 pt-4">
        <h2 className="text-lg font-semibold text-white">GeoJSON</h2>
        <div className="flex space-x-1 items-center">
          <button onClick={handleCopy} title="Copy GeoJSON to Clipboard" className="flex items-center justify-center p-1 hover:text-blue-600 transition">
            <Copy size={20} className="text-blue-500" />
          </button>

          {!isEditing ? (
            <>
              <button onClick={handleUploadClick} className="p-2 text-green-500 rounded-full hover:text-green-600 transition" title="Upload from computer">
                <FolderInput size={18} />
                <input type="file" accept=".geojson" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
              </button>
              <button onClick={handleEdit} className="flex items-center justify-center p-2 text-blue-500 hover:text-blue-700 transition" title="Edit">
                <Pencil size={18} />
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSave} className="flex items-center justify-center p-2 text-green-500 hover:text-green-700 transition" title="Save Changes">
                <Save size={18} />
              </button>
              <button onClick={handleCancel} className="flex items-center justify-center p-2 text-red-500 hover:text-red-700 transition" title="Cancel">
                <X size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className={`border rounded-lg h-[70vh] scrollbar-custom max-h-[400px] bg-bg-color border-button-color ${isEditing ? 'overflow-y-hidden' : 'overflow-y-auto'}`}>
        {isEditing ? (
          <textarea value={editableData} onChange={(e) => setEditableData(e.target.value)} className="w-full h-full bg-bg-color text-white p-2 rounded-md" />
        ) : editableData ? (
          <div className="text-[0.7rem] text-button-select-color">
            {renderWithLineNumbers(editableData)}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic p-2">No data available.</p>
        )}
      </div>
    </div>
  );
};

export default InputTab;
