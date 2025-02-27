import { createSelector } from 'reselect';

const selectgeojsonReducer = (state) => state.geojson;

export const selectGeojson = createSelector(
  [selectgeojsonReducer],
  (geojson) => geojson.geojson
);