import { rectangle } from "leaflet";
import { changeButton } from "../store/Slices/ButtonSlice/buttonSlice";
import { addPolygon } from "../store/Slices/GeojsonSlice/geojsonSlice";
import { addClassPolygon } from "../store/Slices/ClassjsonSlice/classjsonSlice";
import { addClass } from "../store/Slices/ThresholdModelSlice/thresholdModelSlice";

const doubleClickZoom = {
  enable: (ctx) => {
    setTimeout(() => {
      if (
        !ctx.map ||
        !ctx.map.doubleClickZoom ||
        !ctx._ctx ||
        !ctx._ctx.store ||
        !ctx._ctx.store.getInitialConfigValue
      )
        return;
      if (!ctx._ctx.store.getInitialConfigValue('doubleClickZoom')) return;
      ctx.map.doubleClickZoom.enable();
    }, 0);
  },
  disable(ctx) {
    setTimeout(() => {
      if (!ctx.map || !ctx.map.doubleClickZoom) return;
      ctx.map.doubleClickZoom.disable();
    }, 0);
  }
};

const DrawRectangle = (dispatch, isRoi) => {
  // HTML overlay ID
  const OVERLAY_ID = 'fixed-rectangle-overlay';
  
  return {
    onSetup: function () {
      // Create a dummy feature for internal tracking
      const rectangle = this.newFeature({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[]]
        }
      });
      
      this.addFeature(rectangle);
      this.clearSelectedFeatures();
      doubleClickZoom.disable(this);
      
      // Create HTML overlay for fixed rectangle
      this.createFixedRectangleOverlay();
      
      return {
        rectangle
      };
    },
    
    // Create a fixed HTML overlay rectangle
    createFixedRectangleOverlay: function() {
      // Remove existing overlay if it exists
      this.removeFixedRectangleOverlay();
      
      // Size in centimeters (4cm square)
      const sizeInCm = 4;
      
      // Convert cm to pixels (assuming standard 96 DPI)
      const sizeInPixels = sizeInCm * 37.8; // ~151px for 4cm
      
      // Get map container
      const mapContainer = this.map.getContainer();
      
      // Create overlay element
      const overlay = document.createElement('div');
      overlay.id = OVERLAY_ID;
      overlay.style.position = 'absolute';
      overlay.style.width = `${sizeInPixels}px`;
      overlay.style.height = `${sizeInPixels}px`;
      overlay.style.border = '2px solid #3bb2d0'; // MapboxGL Draw default color
      overlay.style.backgroundColor = 'rgba(59, 178, 208, 0.1)'; // Light blue fill
      overlay.style.zIndex = 1000;
      overlay.style.pointerEvents = 'none'; // Allow clicks to pass through
      
      // Center the overlay
      overlay.style.top = '50%';
      overlay.style.left = '50%';
      overlay.style.transform = 'translate(-50%, -50%)';
      
      // Add the overlay to the map container
      mapContainer.appendChild(overlay);
      
      // Add a click handler to the map for capturing coordinates
      this.map.once('click', this.handleMapClick.bind(this));
    },
    
    // Handle map click to capture the current rectangle
    handleMapClick: function() {
      // Get the current center of the map in geographic coordinates
      const center = this.map.getCenter();
      
      // Size in centimeters (4cm square)
      const sizeInCm = 4;
      
      // Convert cm to pixels (assuming standard 96 DPI)
      const sizeInPixels = sizeInCm * 37.8;
      
      // Get the map container dimensions
      const mapContainer = this.map.getContainer();
      
      // Convert screen pixels to geographic coordinates
      const halfSize = sizeInPixels / 2;
      const centerPoint = {
        x: mapContainer.offsetWidth / 2,
        y: mapContainer.offsetHeight / 2
      };
      
      const topLeft = this.map.unproject([centerPoint.x - halfSize, centerPoint.y - halfSize]);
      const topRight = this.map.unproject([centerPoint.x + halfSize, centerPoint.y - halfSize]);
      const bottomRight = this.map.unproject([centerPoint.x + halfSize, centerPoint.y + halfSize]);
      const bottomLeft = this.map.unproject([centerPoint.x - halfSize, centerPoint.y + halfSize]);
      
      // Update the invisible feature with these coordinates
      const state = this.getState();
      state.rectangle.updateCoordinate('0.0', topLeft.lng, topLeft.lat);
      state.rectangle.updateCoordinate('0.1', topRight.lng, topRight.lat);
      state.rectangle.updateCoordinate('0.2', bottomRight.lng, bottomRight.lat);
      state.rectangle.updateCoordinate('0.3', bottomLeft.lng, bottomLeft.lat);
      state.rectangle.updateCoordinate('0.4', topLeft.lng, topLeft.lat);
      
      // Finish the drawing operation
      this.changeMode('simple_select', { featuresId: state.rectangle.id });
    },
    
    // Remove the HTML overlay
    removeFixedRectangleOverlay: function() {
      const existingOverlay = document.getElementById(OVERLAY_ID);
      if (existingOverlay) {
        existingOverlay.remove();
      }
    },
    
    onStop: function (state) {
      // Remove the overlay when stopping
      this.removeFixedRectangleOverlay();
      
      doubleClickZoom.enable(this);
      this.updateUIClasses({ mouse: 'none' });
      this.activateUIButton();

      // Check to see if we've deleted this feature
      if (this.getFeature(state.rectangle.id) === undefined) return;

      if (state.rectangle.isValid()) {
        this.map.fire('draw.create', {
          features: [state.rectangle.toGeoJSON()]
        });

        let geoJson = state.rectangle.toGeoJSON();

        if (isRoi) {
          dispatch(addPolygon(geoJson));
          dispatch(changeButton({type: "enableROI", payload: false}));
          console.log("set ROI", geoJson);
          dispatch(changeButton({type: 'drawControl', payload: false}));
        } else {
          dispatch(addClassPolygon(geoJson));
          dispatch(addClass());
          console.log("set class", geoJson);
        }
      } else {
        this.deleteFeature([state.rectangle.id], { silent: true });
        this.changeMode('simple_select', {}, { silent: true });
      }
    },
    
    toDisplayFeatures: function (state, geojson, display) {
      // We're using our custom HTML overlay instead of the Draw feature
      // Only show the feature after it's been placed on the map
      if (geojson.properties.id === state.rectangle.id && state.rectangle.coordinates && 
          state.rectangle.coordinates[0] && state.rectangle.coordinates[0].length > 3) {
        display(geojson);
      }
    },
    
    onTrash: function (state) {
      this.removeFixedRectangleOverlay();
      this.deleteFeature([state.rectangle.id], { silent: true });
      this.changeMode('simple_select');
    }
  }
};

export default DrawRectangle;