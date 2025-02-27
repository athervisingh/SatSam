import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

const MapWithCanvasOverlay = ({ geoJson, imageDirectory }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize Mapbox map
    mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [77.0, 28.5], // Default center point
      zoom: 7,
    });

    mapInstanceRef.current = map;

    map.on("load", () => {
      console.log("Map loaded");
      setupCanvasOverlay(map, geoJson, imageDirectory);
    });

    return () => map.remove();
  }, ); //[geoJson, imageDirectory]

  const setupCanvasOverlay = async (map, geoJson, imageDirectory) => {
    // Calculate bounding box of the GeoJSON
    const bounds = geoJson.features[0].geometry.coordinates[0].reduce(
      (acc, coord) => {
        acc.minLng = Math.min(acc.minLng, coord[0]);
        acc.maxLng = Math.max(acc.maxLng, coord[0]);
        acc.minLat = Math.min(acc.minLat, coord[1]);
        acc.maxLat = Math.max(acc.maxLat, coord[1]);
        return acc;
      },
      { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity }
    );

    // Create a canvas element
    const canvas = document.createElement("canvas");
    canvas.width = 2000; // Adjust resolution
    canvas.height = 2000;
    const ctx = canvas.getContext("2d");

    // Add canvas source to the map
    map.addSource("canvas-source", {
      type: "canvas",
      canvas: canvas,
      coordinates: [
        [bounds.minLng, bounds.maxLat], // Top-left
        [bounds.maxLng, bounds.maxLat], // Top-right
        [bounds.maxLng, bounds.minLat], // Bottom-right
        [bounds.minLng, bounds.minLat], // Bottom-left
      ],
    });

    // Add canvas layer
    map.addLayer({
      id: "canvas-layer",
      type: "raster",
      source: "canvas-source",
    });

    // Load and render images
    await loadAndRenderImages(ctx, imageDirectory, geoJson, bounds, canvas);
  };

  const loadAndRenderImages = async (ctx, imageDirectory, geoJson, bounds, canvas) => {
    try {
      const imageFiles = await fetchImageFiles(imageDirectory);

      for (const imageFile of imageFiles) {
        const image = new Image();

        image.onload = () => {
          // Calculate position on the canvas
          const [minLng, maxLng, minLat, maxLat] = [
            bounds.minLng,
            bounds.maxLng,
            bounds.minLat,
            bounds.maxLat,
          ];

          const widthScale = canvas.width / (maxLng - minLng);
          const heightScale = canvas.height / (maxLat - minLat);

          // Assuming image alignment with GeoJSON (example coordinates)
          const featureCoords = geoJson.features[0].geometry.coordinates[0];
          const [topLeftLng, topLeftLat] = featureCoords[0];
          const [bottomRightLng, bottomRightLat] = featureCoords[2];

          const x = (topLeftLng - minLng) * widthScale;
          const y = (maxLat - topLeftLat) * heightScale;
          const width = (bottomRightLng - topLeftLng) * widthScale;
          const height = (topLeftLat - bottomRightLat) * heightScale;

          // Draw image on canvas
          ctx.drawImage(image, x, y, width, height);
        };

        image.src = `${imageDirectory}/${imageFile}`;
      }
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  const fetchImageFiles = async (directory) => {
    // Replace this with your API or method to fetch image file names
    return ["image1.png", "image2.png", "image3.png"];
  };

  return <div ref={mapContainerRef} style={{ width: "100%", height: "500px" }} />;
};

export default MapWithCanvasOverlay;
