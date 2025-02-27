import { createSlice } from "@reduxjs/toolkit";

export const dataSlice = createSlice({
  name: "data",
  initialState: {
    ROIdata: [],
    classdata: [],
    dropdownData: [
      { roi: null, fill: null },
      { class: null, fill: null },
    ],
    
    geoJsonData: [],
    regionOverlays: [],
    classOverlays: [],
    layers: [],
    mapInstance: null,
    modelThreshold: null,
    drawInstance: null,
    selectedROI: null,
    selectedClass: null,
    geeImageUrl: null,
    geeAccessToken: null,
  },
  reducers: {
    setModelThreshold(state, action) {
      const { modelName, thresholdValues } = action.payload;
      state.modelThreshold = { modelName, thresholdValues };
      // console.log("Model Threshold State:", JSON.parse(JSON.stringify(state.modelThreshold)));
    },
    setDropdownData: (state, action) => {
      // console.log("BEFORE -----------------:", JSON.parse(JSON.stringify(state)));
      const { value, name, index } = action.payload;

      // if (!state.dropdownData[index]) {  
      //   if (index === 0) {
      //     state.dropdownData[index] = { roi: null, fill: null };
      //   } else {
      //     state.dropdownData[index] = { class: null, fill: null };
      //   }
      // }

      if (index === 0) {
        state.dropdownData[index] = { roi: name, fill: value };
      } else {
        state.dropdownData[index] = { class: name, fill: value };
      }
      // console.log("AFTER -----------------:", JSON.parse(JSON.stringify(state)));
      // console.log(state.dropdownData[index]);
      console.log("redux inside",JSON.stringify(state.dropdownData));
    },

    setGeoJsonData: (state, action) => {
      state.geoJsonData = action.payload.payload;
    },
    setImageData: (state, action) => {
      state.geeImageUrl = action.payload.image_url;
      state.geeAccessToken = action.payload.access_token;
      // console.log(state.geeImageUrl)
      // console.log("Updated State:", JSON.parse(JSON.stringify(state.geeImageUrl)));
      // console.log("Updated State:", JSON.parse(JSON.stringify(state.geeAccessToken )));

    },

    addGeoJsonData: (state, action) => {
      // console.log("action for geo data", action);
      state.geoJsonData.push(action.payload.payload);
      // console.log("geojsonData", state.geoJsonData);
    },

    setRegionOverlays: (state, action) => {
      state.regionOverlays = action.payload.payload;
    },

    addRegionOverlays: (state, action) => {
      state.regionOverlays.push(action.payload);
    },

    setClassOverlays: (state, action) => {
      // console.log(action.payload.payload);
      state.classOverlays.push(action.payload.payload);
    },

    setClassOverlaysOpacity: (state, action) => {
      const { name, value, overlayIndex } = action.payload;

      if (
        state.classOverlays[overlayIndex] &&
        state.classOverlays[overlayIndex][name]
      ) {
        state.classOverlays[overlayIndex][name].opacity += parseFloat(value);
      }
    },

    setROIdata: (state, action) => {
      state.ROIdata = action.payload;
    },

    getROIdata: (state) => {
      const storedData = JSON.parse(localStorage.getItem("roi_data"));
      if (storedData) {
        const newData = Object.keys(storedData).map((ele) => ({
          name: ele,
          value: storedData[ele] || "",
        }));

        state.ROIdata = newData;

        // if (name.length) {
        //     const selectedValue = storedData[name];

        //     dispatch(setDropdownData({ value: selectedValue, name: name, index: 0 }));

        //     if (selectedValue === "-1") {
        //         dispatch(changeButton({ type: 'enableClasses', payload: false }));
        //     } else {
        //         dispatch(changeButton({ type: 'drawControl', payload: true }));
        //     }
        // }
      }
    },

    getClassData: (state) => {
      const storedData = JSON.parse(localStorage.getItem("class_data"));
      if (storedData) {
        const newData = Object.keys(storedData).map((ele) => ({
          name: ele,
          value: storedData[ele] || "",
        }));

        state.classdata = newData;

        // if (name.length) {
        //     setclassSelectionName(name);
        //     setclassSelection(storedData[name]);
        //     name === "-1" ? setdrawControl(false) : setdrawControl(true);
        // }
      }
    },

    setclassdata: (state, action) => {
      state.classdata = action.payload;
    },

    getLayers: (state, action) => {
      let allLayers = state.layers;
      allLayers.push(action.payload);
      state.layers = allLayers;
    },

    setLayers: (state, action) => {
      // console.log("layers action", action);
      state.layers = action.payload;
    },

    setMapInstance: (state, action) => {
      state.mapInstance = action.payload;
    },

    setSelectedROI: (state, action) => {
      state.selectedROI = action.payload;
    },

    setSelectedClass: (state, action) => {
      state.selectedClass = action.payload;
    },
  },
});

export const {
  setModelThreshold,
  setMapInstance,
  addRegionOverlays,
  setDropdownData,
  getROIdata,
  setGeoJsonData,
  addGeoJsonData,
  setRegionOverlays,
  setClassOverlays,
  setClassOverlaysOpacity,
  setROIdata,
  setclassdata,
  setLayers,
  getLayers,
  onSelectionClick,
  getClassData,
  setSelectedClass,
  setSelectedROI,
  setImageData
} = dataSlice.actions;

export default dataSlice.reducer;
