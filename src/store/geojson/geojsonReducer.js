import { createSlice } from '@reduxjs/toolkit';
const GEOJSON_INITIAL_STATE = {
 geojson:{},
};


export const geojsonSlice = createSlice({
  name: 'geojson',
  initialState: GEOJSON_INITIAL_STATE,
  reducers: {
    setGeojson(state, action) {
      state.geojson = action.payload;
    },
  },
});

export const { setGeojson } = geojsonSlice.actions;

export const geojsonReducer = geojsonSlice.reducer;