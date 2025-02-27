import { Copy, Download } from "lucide-react";
import { useState, useEffect } from "react";
import '../../mapControls.css';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const OutputTab = () => {
  const geojsonData = useSelector((state) => state.geojsonData.geojsonData);
  console.log("=>",geojsonData)
  const [data, setData] = useState("");
  const {mapInstance} = useSelector((state)=> state.dataSlice)
  // Create features from geojsonData
  useEffect(() => {
    
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
      
      setData(geoJsonString);

    
  }, [mapInstance, geojsonData]);

  const handleDownload = () => {
    if (!data) return;
    const blob = new Blob([data], { type: "application/geojson" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.geojson";
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Download started!');
  };

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data).then(
      () => toast.success('Data copied to clipboard!'),
      () => toast.error('Failed to copy data.')
    );
  };

  const renderWithLineNumbers = (text) => {
    return text.split("\n").map((line, index) => (
      <div key={index} className="flex">
        <span className="text-gray-400 w-8 text-right pr-2">{index + 1}</span>
        <pre className="flex-1 whitespace-pre-wrap">{line}</pre>
      </div>
    ));
  };

  return (
    <div className="rounded-lg bg-bg-color">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4 pt-4">
        <h2 className="text-lg font-semibold text-white">GeoJSON</h2>
        <div className="flex space-x-1">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy GeoJSON to Clipboard"
            className="p-2 hover:text-blue-600 text-blue-500 transition"
          >
            <Copy size={18} />
          </button>
          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="p-2 text-green-500 rounded-full hover:text-green-600 transition"
            title="Download GeoJSON File"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div className="border rounded-lg h-[72vh] overflow-y-auto scrollbar-custom max-h-[400px] bg-bg-color border-button-color">
        {data ? (
          <div className="text-[0.7rem] text-button-select-color">
            {renderWithLineNumbers(data)}
          </div>
        ) : (
          <p className="text-sm p-2 text-gray-500 italic">No data available.</p>
        )}
      </div>
    </div>
  );
};

export default OutputTab;
