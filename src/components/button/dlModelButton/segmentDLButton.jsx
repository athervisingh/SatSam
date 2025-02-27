import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Button from '../button.component'; // Assuming you have a Button component
// import { changeButton } from "../../../store/Slices/ButtonSlice/buttonSlice";// Your Redux action for button states
import { useRef, useEffect } from "react";
const SegmentDLButton = () => {
  const dispatch = useDispatch();
  const { mapInstance } = useSelector((state) => state.dataSlice); // Assuming you have a Mapbox map initialized elsewhere in your code
  const  {modelThreshold}  = useSelector((state) => state.thresholdModelSlice); // Assuming you have a Mapbox map initialized elsewhere in your code
  const classjsonData = useSelector((state) => state.classjsonData); // Assuming you have a Mapbox map initialized elsewhere in your code
  // const {modelSelection} = useSelector((state) => state.addDetailsSlice); // Assuming you have a Mapbox map initialized elsewhere in your code
  const map = mapInstance;
  const canvasesRef = useRef({});
  // const { segmentButtonDisabled } = useSelector((state) => state.buttonSlice);
  const { dropdownData } = useSelector((state) => state.dataSlice);
  const geojsonData = useSelector((state) => state.geojsonData.geojsonData);
  console.log("Model Threshold" , modelThreshold)

  var geo = JSON.parse(JSON.stringify(geojsonData));
  if (geo.length > 0) geo[0].properties = dropdownData[0];
  

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
    
    return {canvasWidthInPixels, canvasHeightInPixels};
  }

  function getCanvasBounds(geojson) {
    if (!geojson) {
      throw new Error("Invalid GeoJSON data");
    }
    console.log(geojson)
    console.log(geojsonData)
    // console.log("Updated json:", JSON.parse(JSON.stringify(geojsonData.geojsonData)));
    const coordinates = geojson[0].geometry.coordinates[0];
    console.log(coordinates)
    // const coordinates = geojson;
    if (!coordinates || coordinates.length < 4) {
      throw new Error("Invalid coordinates in GeoJSON data");
    }
  
    // Extract coordinates for the top-left and bottom-right
    const topLeft = coordinates[0]; // First coordinate
    const bottomRight = coordinates[2]; // Third coordinate
  
    return [
      [topLeft[0], topLeft[1]], // Top-left
      [bottomRight[0], bottomRight[1]] // Bottom-right
    ];
  }


  const canvasBounds = getCanvasBounds(geo);

  // const canvasBounds = [
  //   [
  //     75.02557800067922,
  //     24.947601861587046
  //   ], // Top-left
  //   [
  //     76.13585435619927,
  //     24.30404927543755
  //   ],// Bottom-right
  // ];



  const setupCanvas = (className) => {
    const dimensions = calculateCanvasDimensions(canvasBounds, 30);
    const canvas = document.createElement("canvas");
    canvas.width = dimensions.canvasWidthInPixels;
    canvas.height = dimensions.canvasHeightInPixels;
    canvas.id = `${className}Canvas`;

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    // context.fillStyle = "rgba(255, 0, 0, 0.3)";
    // context.fillRect(0, 0, canvas.width, canvas.height);

    canvasesRef.current[className] = { canvas, context };
    
    const sourceId = `${className}-canvas-source`; // Unique ID for the source
    const layerId = `${className}-canvas-layer`; // Unique ID for the layer

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

    console.log(`Canvas created: ${className}Canvas`);
};
  useEffect(() => {
    if (!map) {
      console.error("Map instance is null or undefined");
      return;
    }
  
  


    // return () => {
    //   setupCanvas();
    // };
  }, [map,classjsonData,geojsonData]);

  const drawCanvas = (image, top_left, shape, className) => {
    const { canvas, context } = canvasesRef.current[className];
    console.log("canvas",canvas)
    console.log("context",context)
   

    const img = new Image();
    img.src =` data:image/png;base64,${image}`;
    img.onload = () => {

      const [canvastopLeftLon, canvastopLeftLat] = canvasBounds[0];
      const [canvasbottomRightLon, canvasbottomRightLat] = canvasBounds[1];
      const [imgTopLeftLon, imgTopLeftLat] = top_left
      console.log(imgTopLeftLon, imgTopLeftLat)
      const canvasWidthInDegrees = canvasbottomRightLon - canvastopLeftLon; 
      const canvasHeightInDegrees = canvastopLeftLat - canvasbottomRightLat;
      
      // Get the actual canvas width and height in pixels
      const canvasWidth = canvas.width; 
      const canvasHeight = canvas.height;
      
      // Calculate scale factors (pixels per degree)
      const scaleX = canvasWidth / canvasWidthInDegrees;  // pixels per degree of longitude
      const scaleY = canvasHeight / canvasHeightInDegrees;  // pixels per degree of latitude
      
      // Now calculate the map position of the image's top-left corner in canvas coordinates
      var img_x = (imgTopLeftLon - canvastopLeftLon) * scaleX;
      var img_y = (canvastopLeftLat - imgTopLeftLat) * scaleY;
      
      // Image dimensions in pixels (shape array)
      const imageWidth = shape[1];
      const imageHeight = shape[0];

      console.log(img_x, img_y, imageWidth, imageHeight);
      context.drawImage(img, img_x, img_y, imageWidth, imageHeight);
      img_x = 0;
      img_y = 0;
      console.log(`Image drawn on ${className}Canvas`);
    };
  };




  // Function to send GeoJSON data to the backend
  const sendMaskData = async () => {
    // console.log(classjsonData);
    try {
      const combinedData = {
        // classGeojson:classjsonData.classjsonData,
        // model:modelSelection,
        // threshold_and_model: modelThreshold, 
        roi:geo[0]
      };

      // console.log("Sending mask data to backend:", combinedData);

      await axios.post("https://8z2h0gbj-5001.inc1.devtunnels.ms/deep_learning",combinedData,  {
        // timeout: 10000,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log("bfmbdfmsmnfnsmfm")
      const eventSource = new EventSource("https://8z2h0gbj-5001.inc1.devtunnels.ms/deep_learning_stream", {
        withCredentials: true,
      });

      eventSource.onmessage = (event) => {
        try {
          const chunk = JSON.parse(event.data);
          console.log("Received chunk:", chunk);
      
          const {top_left, shape, masks } = chunk;
          console.log(chunk)

          if(chunk.status === "Loading..."){


            console.log(typeof masks)
            if (!masks || typeof masks !== "object") {
              console.error("Invalid masks data:", masks);
              return; // Skip processing if masks is invalid
            }
        
            for (const [className, base64] of Object.entries(masks)) {
              // console.log(Processing class: ${className});
              // console.log(Base64 image length: ${base64.length});
              setupCanvas(className);
              console.log("Canvas setup done");
              drawCanvas(base64, top_left, shape, className);
              console.log("Canvas draw done");
            }
        


          }
           
          if (chunk.status === "Completed") {
            eventSource.close();
            console.log("All images loaded.");
            console.log(chunk.area)
          }
        } catch (error) {
          console.error("Error processing event data:", error);
        }
      };
      

      eventSource.onerror = (error) => {
        console.error("SSE Error:", error);
        eventSource.close();
        alert("An error occurred while receiving the data.");
      };

      // dispatch(changeButton({ type: "enableClasses", payload: true }));
      // dispatch(changeButton({ type: "showImageButton", payload: false }));
    } catch (error) {
      console.error("Error:", error);
      alert("An unknown error occurred.");
    }
  };

  const handleClick = () => {
    console.log("ImageButton clicked!");
    sendMaskData();
  };

  return (
    <div className="absolute bottom-0 left-[2%] z-[6005]" onClick={handleClick}>
      <Button label={"SegmentDL"} />
    </div>
  )
};

export default SegmentDLButton;