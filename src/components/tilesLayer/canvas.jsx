import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapWithCanvasImage = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const imageCanvas = useRef(null);

  // Canvas geographical bounds
  const canvasBounds = [
    [75.03213579627356, 25.907965370487148], // Top-left
    [78.64053158205974, 23.09455466564438],  // Bottom-right
  ];

  // Geographical coordinate where the image will be placed
  const imageCoordinates = [76.32670474318184,
    23.665916201157117]; // Example geographic coordinates

  useEffect(() => {
    const MAPBOX_TOKEN = "pk.eyJ1Ijoia2hhbGVlcXVlNTYiLCJhIjoiY200NXphMDg2MHZzODJxc2Jha3F5N3VnYiJ9.oEzy-505dRBcBamWC6QOqA";
    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [76.8, 24.5],
      zoom: 6,
    });

    // Add canvas as a source
    map.current.on("load", () => {
      const canvas = document.createElement("canvas");
      imageCanvas.current = canvas;

      canvas.width = 10000; // Adjust dimensions
      canvas.height = 8000;

      map.current.addSource("canvas-source", {
        type: "canvas",
        canvas: canvas,
        coordinates: [
          canvasBounds[0],
          [canvasBounds[1][0], canvasBounds[0][1]],
          canvasBounds[1],
          [canvasBounds[0][0], canvasBounds[1][1]],
        ],
      });

      map.current.addLayer({
        id: "canvas-layer",
        type: "raster",
        source: "canvas-source",
      });

      drawCanvas(); // Initial drawing

      // Redraw the canvas when the map moves or zooms
      // map.current.on("move", drawCanvas);
      // map.current.on("zoom", drawCanvas);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Function to draw on the canvas
  const drawCanvas = () => {
    const canvas = imageCanvas.current;
    const context = canvas.getContext("2d");

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Fill background with semi-transparent red
    context.fillStyle = "rgba(255, 0, 0, 0.3)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Load and draw the image
    const img = new Image();
    img.src = "/16.jpg"; // Replace with your image URL
    img.onload = () => {
      // Project the geographic coordinates to pixel positions
      const pixelPosition = map.current.project(imageCoordinates);

      // Calculate relative position on the canvas
      const canvasBoundsPixel = {
        topLeft: map.current.project(canvasBounds[0]),
        bottomRight: map.current.project(canvasBounds[1]),
      };

      const canvasWidth = canvasBoundsPixel.bottomRight.x - canvasBoundsPixel.topLeft.x;
      const canvasHeight = canvasBoundsPixel.bottomRight.y - canvasBoundsPixel.topLeft.y;

      const x = ((pixelPosition.x - canvasBoundsPixel.topLeft.x) / canvasWidth) * canvas.width;
      const y = ((pixelPosition.y - canvasBoundsPixel.topLeft.y) / canvasHeight) * canvas.height;

      // Draw the image on the canvas
      context.drawImage(img, x - img.width / 2, y - img.height / 2);
    };
  };

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
};

export default MapWithCanvasImage;
