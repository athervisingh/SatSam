import { createSlice } from '@reduxjs/toolkit';

const classJsonSlice = createSlice({
  name: 'classjsonData',
  initialState: {
    properties:null, // Array of objects
    classjsonData: [], // Array of objects
  },
  reducers: {
    deleteClassPolygon : (state,action) =>{ // we will got a classname
      state.classjsonData = state.classjsonData.filter((classname)=> classname.properties.class !== action.payload ) 
    },
    addClassPolygon: (state, action) => {
      console.log("BEFORE -----------------:", JSON.parse(JSON.stringify(state.classjsonData)));
      const newPolygon = {
        ...action.payload,
        properties: state.properties,
      };

      state.classjsonData.push(newPolygon);

      console.log("AFTER -----------------:", JSON.parse(JSON.stringify(state.classjsonData)));
    },
    addClassProperties: (state, action) => {
      console.log("BEFORE -----------------:", JSON.parse(JSON.stringify(state)));
        state.properties =action.payload; 
    
      console.log("AFTER -----------------:", JSON.parse(JSON.stringify(state)));

    },
    clearClassAll: (state) => {
      state.properties = [];
      state.geojsonData = [];
    },
  },
});

export const {deleteClassPolygon, addClassPolygon, addClassProperties, clearClassAll } = classJsonSlice.actions;
export default classJsonSlice.reducer;
