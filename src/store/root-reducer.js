import { combineReducers } from "@reduxjs/toolkit";
import { geojsonReducer } from "./geojson/geojsonReducer";
import { userReducer } from "./user/user.reducer";

import dataSlice from "./Slices/DataSlice/dataSlice";
import buttonSlice from "./Slices/ButtonSlice/buttonSlice";
import addDetailsSlice from "./Slices/AdditionalDetailsSlice/addDetailsSlice";
import geojsonSlice from "./Slices/GeojsonSlice/geojsonSlice";  // added by pk
import classJsonSlice from "./Slices/ClassjsonSlice/classjsonSlice";  // added by pk
import thresholdModelSlice from './Slices/ThresholdModelSlice/thresholdModelSlice';

export const rootReducer = combineReducers({
  geoJson: geojsonReducer,
  user: userReducer,
  dataSlice: dataSlice,
  buttonSlice: buttonSlice,
  addDetailsSlice: addDetailsSlice,
  geojsonData: geojsonSlice, // added by pk
  classjsonData: classJsonSlice, // added by pk
  thresholdModelSlice:thresholdModelSlice
});
