import React, { useRef, useState, useEffect } from "react";
import { PlusCircle, MinusCircle, MousePointer2 } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";

const SetMapButton = () => {
  const geojsonData = useSelector((state) => state.geojsonData);
  const geo = JSON.parse(JSON.stringify(geojsonData));
  const { bandValues, date } = useSelector((state) => state.addDetailsSlice);
  const canvasRef = useRef({});
  const { mapInstance } = useSelector((state) => state.dataSlice);
  const [image, setImage] = useState("");
  const map = mapInstance;
  function getCanvasBounds(geojson) {
    if (!geojson) {
      throw new Error("Invalid GeoJSON data");
    }
    console.log("geooooo", geojson);
    // console.log(geojsonData)
    // console.log("Updated json:", JSON.parse(JSON.stringify(geojsonData.geojsonData)));
    const coordinates = geojson[0]?.geometry?.coordinates[0] || [];
    console.log(coordinates);
    // const coordinates = geojson;
    if (!coordinates || coordinates.length < 4) {
      // throw new Error("Invalid coordinates in GeoJSON data");
      return;
    }

    // Extract coordinates for the top-left and bottom-right
    const topLeft = coordinates[0]; // First coordinate
    const bottomRight = coordinates[2]; // Third coordinate

    return [
      [topLeft[0], topLeft[1]], // Top-left
      [bottomRight[0], bottomRight[1]], // Bottom-right
    ];
  }

  const canvasBounds = getCanvasBounds(geo.geojsonData);
  function calculateCanvasDimensions(canvasBounds, scale) {
    // Extract the top-left and bottom-right coordinates from the bounds
    const [topLeftLon, topLeftLat] = canvasBounds[0]; // Top-left [longitude, latitude]
    const [bottomRightLon, bottomRightLat] = canvasBounds[1]; // Bottom-right [longitude, latitude]

    // Calculate the width and height of the canvas in degrees (longitude, latitude)
    const canvasWidthInDegrees = bottomRightLon - topLeftLon;
    const canvasHeightInDegrees = topLeftLat - bottomRightLat;

    // Define a function to convert degrees to meters (this is a rough conversion)
    function degreesToMeters(degrees) {
      const earthRadius = 6371000; // Earth's radius in meters
      const rad = degrees * (Math.PI / 180);
      return earthRadius * rad;
    }

    // Convert the width and height of the canvas in degrees to meters
    const canvasWidthInMeters = degreesToMeters(canvasWidthInDegrees);
    const canvasHeightInMeters = degreesToMeters(canvasHeightInDegrees);

    // Now calculate the resolution in pixels (using the scale in meters per pixel)
    const canvasWidthInPixels = canvasWidthInMeters / scale;
    const canvasHeightInPixels = canvasHeightInMeters / scale;

    return { canvasWidthInPixels, canvasHeightInPixels };
  }
  const handleCanvasClick = (event) => {
    if (!canvasRef.current.canvas) return;

    // Get the canvas and its bounding rectangle
    const canvas = canvasRef.current.canvas;    
    const rect = canvas.getBoundingClientRect();

    // Calculate click coordinates relative to the canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = (event.clientX - rect.left) * scaleX;
    const canvasY = (event.clientY - rect.top) * scaleY;

    console.log('Canvas Click Coordinates:', {
      x: canvasX, 
      y: canvasY
    });

  const setupCanvas = () => {
    const dimensions = calculateCanvasDimensions(canvasBounds, 30);
    const canvas = document.createElement("canvas");
    canvas.width = dimensions.canvasWidthInPixels;
    canvas.height = dimensions.canvasHeightInPixels;
    canvas.id = "sam-canvas";
    canvas.addEventListener('click', handleCanvasClick);
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(255, 0, 0, 0.3)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    canvasRef.current = { canvas, context };
    const sourceId = `souce-canvas-source`; // Unique ID for the source
    const layerId = `layer-canvas-layer`;

    if (map.getSource(sourceId)) {
      console.warn(`Source ${sourceId} already exists. Skipping creation.`);
      return;
    }

    map.addSource(sourceId, {
      type: "canvas",
      canvas: canvas,
      coordinates: [
        canvasBounds[0],
        [canvasBounds[1][0], canvasBounds[0][1]],
        canvasBounds[1],
        [canvasBounds[0][0], canvasBounds[1][1]],
      ],
    });

    map.addLayer({
      id: layerId,
      type: "raster",
      source: sourceId,
    });
    console.log(`Canvas created: Canvas`);
  };

  // useEffect(() => {
  //   if (!map) {
  //     console.error("Map instance is null or undefined");
  //     return;
  //   }
  // }, [map,geojsonData]);
  // Adjust the canvas to fit the GeoJSON bounds
  const drawCanvas = (image, top_left, shape) => {
    const { canvas, context } = canvasRef.current;
    console.log("canvas", canvas);
    console.log("context", context);
    const img = new Image();
    img.src = ` data:image/png;base64,${image}`;
    img.onload = () => {
      const [canvastopLeftLon, canvastopLeftLat] = canvasBounds[0];
      const [canvasbottomRightLon, canvasbottomRightLat] = canvasBounds[1];
      const [imgTopLeftLon, imgTopLeftLat] = top_left;
      console.log(imgTopLeftLon, imgTopLeftLat);

      const canvasWidthInDegrees = canvasbottomRightLon - canvastopLeftLon;
      const canvasHeightInDegrees = canvastopLeftLat - canvasbottomRightLat;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const scaleX = canvasWidth / canvasWidthInDegrees; // pixels per degree of longitude
      const scaleY = canvasHeight / canvasHeightInDegrees;

      var img_x = (imgTopLeftLon - canvastopLeftLon) * scaleX;
      var img_y = (canvastopLeftLat - imgTopLeftLat) * scaleY;

      const imageWidth = shape[1];
      const imageHeight = shape[0];

      console.log(img_x, img_y, imageWidth, imageHeight);
      context.drawImage(img, img_x, img_y, imageWidth, imageHeight);

      img_x = 0;
      img_y = 0;
      console.log(`Image drawn on Canvas`);
    };
  };

  // Function to fetch and render an overlay image on the canvas
  const fetchAndRenderOverlay = async () => {
    console.log('sdnksaddddkn')
    try {
      const combinedData = {
        geojson: geo.geojsonData,
        bands: bandValues,
        date: date,
      };

      const response = await axios.post(
        "https://8z2h0gbj-5001.inc1.devtunnels.ms/getImage",
        combinedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { top_left, shape, masks } = response.data;
      setImage(masks);
      setupCanvas();
      // Render image as overlay on the canvas
      drawCanvas(masks, top_left, shape);

      console.log("Mask shape:", shape);
      console.log("Top left coordinates:", top_left);
    } catch (error) {
      console.error("Error:", error);
      alert("An unknown error occurred while fetching the overlay.");
    }
  };

  return (
    <div className="absolute bottom-10 left-10 z-[6007] bg-yellow-600 w-20 h-16">
      <div className="flehandleCanvasClickx gap-2 mb-4">
        {image && (
          <div>
            <button className={`p-2 rounded-md bg-blue-700`}>
              <PlusCircle size={24} />
            </button>
            <button className={`p-2 rounded-md bg-blue-700`}>
              <MinusCircle size={24} />
            </button>{" "}
          </div>
        )}
      </div>

      <button
        onClick={fetchAndRenderOverlay}
        className="mb-4 p-2 rounded-md hover:bg-yellow-500 transition-all duration-200"
      >
        <MousePointer2 size={24} className="transform -rotate-6" />
      </button>

    </div>
  );
};
}

export default SetMapButton;
