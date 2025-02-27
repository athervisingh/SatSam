import React, { useState, useRef, useEffect } from "react";
import { Download, ImagePlus, MinusCircle, MousePointer2, PlusCircle, ZoomIn, ZoomOut } from "lucide-react";

const UploadImagePage = () => {
  const canvasRef = useRef(null);
  const [imageDimensions, setImageDimensions] = useState(null);
  const [points, setPoints] = useState([]);
  const [value, setValue] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [threshold, setThreshold] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Fixed image path instead of upload
  const fixedImagePath = "/check.png"; // This image should be placed in your public folder

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Store original dimensions
        setImageDimensions({
          width: img.width,
          height: img.height,
          naturalWidth: img.width,
          naturalHeight: img.height
        });

        // Set canvas dimensions with zoom applied
        canvas.width = img.width * zoomLevel;
        canvas.height = img.height * zoomLevel;

        // Clear and redraw all points and the image with the current zoom level
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(zoomLevel, zoomLevel);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
        
        // Redraw all points with the current zoom level
        redrawPoints(ctx);
      };

      img.src = fixedImagePath;
    }
  }, [zoomLevel]); // Re-render when zoom changes

  // Function to redraw all points
  const redrawPoints = (ctx) => {
    if (!ctx) return;
    
    points.forEach((point, index) => {
      const label = finalData[index]?.label;
      ctx.fillStyle = label === 1 ? "greenyellow" : "red";
      ctx.beginPath();
      ctx.arc(point.x * zoomLevel, point.y * zoomLevel, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  useEffect(() => {
    console.log(finalData);
  }, [finalData]);

  const handleCanvasClick = (e) => {
    if (value === null) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      // Adjust coordinates for zoom level
      const x = Math.round((e.clientX - rect.left) / zoomLevel);
      const y = Math.round((e.clientY - rect.top) / zoomLevel);

      setPoints((prevPoints) => [...prevPoints, { x, y }]);
      setFinalData((prev) => [...prev, { coordinates: { x, y }, label: value }]);

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = value === 1 ? "greenyellow" : "red";
      ctx.beginPath();
      ctx.arc(x * zoomLevel, y * zoomLevel, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handleZoomChange = (newZoom) => {
    setZoomLevel(newZoom);
  };

  const handleThresholdChange = (e) => {
    // Accept only numeric input
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    
    // Update threshold with any numeric value
    setThreshold(newValue === '' ? '' : parseInt(newValue, 10));
  };

  const handleDataSend = () => {
    console.log("Processing data with points:", finalData);
    alert(`Processing ${finalData.length} points with threshold: ${threshold}`);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 flex items-center justify-center relative overflow-auto">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="shadow-2xl cursor-crosshair"
            onClick={handleCanvasClick}
          ></canvas>
        </div>
      </div>

      <div className="w-16 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col items-center py-6 shadow-lg">
        <button
          className={`mb-4 p-2 rounded-md hover:bg-gray-700 transition-all duration-200 ${value === 1 ? "bg-blue-700" : ""}`}
          onClick={() => setValue(1)}
          title="Add positive point"
        >
          <PlusCircle size={24} />
        </button>
        <button
          className={`mb-4 p-2 rounded-md hover:bg-gray-700 transition-all duration-200 ${value === 0 ? "bg-blue-700" : ""}`}
          onClick={() => setValue(0)}
          title="Add negative point"
        >
          <MinusCircle size={24} />
        </button>
        <button
          onClick={() => {
            setPoints([]);
            setFinalData([]);
            setValue(null);
            
            // Redraw the canvas without points
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext("2d");
              const img = new Image();
              img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();
                ctx.scale(zoomLevel, zoomLevel);
                ctx.drawImage(img, 0, 0);
                ctx.restore();
              };
              img.src = fixedImagePath;
            }
          }}
          className="mb-4 p-2 rounded-md hover:bg-red-600 transition-all duration-200"
          title="Clear all points"
        >
          <ImagePlus size={24} className="transform rotate-45" />
        </button>
        <button
          onClick={handleDataSend}
          className="mb-4 p-2 rounded-md hover:bg-yellow-500 transition-all duration-200"
          title="Process data"
        >
          <MousePointer2 size={24} className="transform -rotate-6" />
        </button>
      </div>

      <div className="w-48 bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4 text-white">Settings</h2>
        
        <div className="mb-6">
          <h3 className="font-medium text-white mb-2">Threshold</h3>
          <input
            type="text" 
            value={threshold}
            onChange={handleThresholdChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="Enter threshold"
          />
          <div className="text-xs text-gray-400 mt-1">Enter any numeric value</div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium text-white mb-2">Zoom</h3>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={zoomLevel}
            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-blue-300 to-blue-600 rounded-full appearance-none cursor-pointer focus:outline-none"
          />
          <div className="text-sm text-white mt-1">
            {Math.round(zoomLevel * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImagePage;