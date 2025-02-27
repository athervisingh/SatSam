import { createSlice } from '@reduxjs/toolkit';

const geojsonSlice = createSlice({
  name: 'geojsonData',
  initialState: {
    properties: null, // Array of objects
    geojsonData: [], // Array of objects
  },
  reducers: {
    
    addPolygon: (state, action) => {
      console.log("BEFORE -----------------:", JSON.parse(JSON.stringify(state)));
      const newPolygon = {
        ...action.payload,
        properties:state.properties,
      };
      state.geojsonData.push(newPolygon);
      console.log("AFTER -----------------:", JSON.parse(JSON.stringify(state)));
    },
    addProperties: (state, action) => {
      console.log("BEFORE -----------------:", JSON.parse(JSON.stringify(state)));

      // if (Array.isArray(action.payload)) {
      //   state.properties = [...state.properties, ...action.payload];
      // } else {
        state.properties = action.payload; 
      // }
      
      console.log("AFTER -----------------:", JSON.parse(JSON.stringify(state)));

    },
    updatePolygon: (state,action)=>{
      
      state.geojsonData = action.payload
      console.log("++++++++++++++",state.geojsonData)
    },
    clearAll: (state) => {
      state.properties = [];
      state.geojsonData = [];
    },
  },
});

export const { addPolygon, addProperties, clearAll ,updatePolygon} = geojsonSlice.actions;
export default geojsonSlice.reducer;
