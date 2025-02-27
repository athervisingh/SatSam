import { createSlice } from '@reduxjs/toolkit';

const thresholdModelSlice = createSlice({
  name: 'thresholdModelSlice',
  initialState: {
    classname : [],
    modelThreshold : {
        model : "Mahalanobis Model", 
        thresholds : {
        },
    },
    opacity: [],
    selectedClass : null
  },
  reducers: {
    deleteClass : (state,action)=>{
      state.classname = state.classname.filter((name)=> name !== action.payload);
    },
    addClass : (state , action)=>{

        if(!state.classname.includes(state.selectedClass)){
            state.classname.push(state.selectedClass);
            if(state.modelThreshold.model === "Mahalanobis Model"){
                const newThreshold = {};
                state.classname.map((ele)=>{
                    newThreshold[ele] = 5;
                });
                state.modelThreshold.thresholds = newThreshold;
                
            }else if(state.modelThreshold.model === "Maximum Likelyhood Classifier"){
                state.modelThreshold.thresholds["value"] = 10;
                
            }
            state.opacity.push(0.5);
        }
    },
    setCurrentClass : (state , action)=>{
        state.selectedClass = action.payload;
    },
    onModelChange: (state, action) => {
        if  (action.payload === "Mahalanobis Model") {
          const newThreshold = {};
          state.classname.forEach((ele) => {
            newThreshold[ele] = 5; // Default value
          });
          state.modelThreshold.thresholds = newThreshold;
        } else if (state.modelThreshold.model === "Maximum Likelyhood Classifier") {
          state.modelThreshold.thresholds = { value: 10 };
        }
        state.modelThreshold.model = action.payload
      },
      updateThreshold: (state, action) => {
        const { className, newValue } = action.payload;
        state.modelThreshold.thresholds[className] = newValue;
      },
  },
});

export const { addClass , setCurrentClass, onModelChange, updateThreshold,deleteClass } = thresholdModelSlice.actions;
export default thresholdModelSlice.reducer;
