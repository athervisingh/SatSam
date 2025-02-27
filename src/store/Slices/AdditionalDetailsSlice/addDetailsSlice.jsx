import { createSlice } from "@reduxjs/toolkit";

const addDetailsSlice = createSlice({
    name: "addDetailsSlice",
    initialState: {
        bandValues: { band1: "B4", band2: "B3", band3: "B2", },
        ThresholdClass: [],
        modelSelection: "Mahalanobis Distance Classifier",
        modelThresHold: '1',
        date: null,
        mobileMode : false,
        imageResponseSignal : false,
        maskResponseSignal : false,
        maskAreaData : [],
    },
    reducers: {
        setMaskAreaData : (state,action)=>{
            state.maskAreaData = action.payload;
        },
        sendSignalforButtonResponse: (state, action)=>{
            state.imageResponseSignal = action.payload;
        },
        sendSignalforMaskResponse: (state, action)=>{
            state.maskResponseSignal = action.payload;
        },
        setBandValues: (state, action) => {
            const { bandkey, value } = action.payload; // Use `bandkey` as passed
            if (state.bandValues[bandkey]) { // Ensure key exists
                state.bandValues[bandkey] = value;
                console.log("Updated State band val:", JSON.parse(JSON.stringify(state.bandValues)));
            } else {
                console.error(`Invalid bandkey: ${bandkey}`);
            }
        },
        setThresholdClass: (state, action) => {
            const { name } = action.payload;
            state.ThresholdClass.push(name);
        },
        setModelSelection: (state, action) => {
            const value = action.payload;
            state.modelSelection = value;
            // console.log(state.modelSelection);
        },
        setModelThresHoldValue: (state, action) => {
            const { value } = action.payload;
            state.modelThresHold = value;
        },
        setModelThresHoldObject: (state, action) => {
            const { name, value } = action.payload;
            state.modelThresHold[name] = value;
        },
        setDate: (state, action) => {
            state.date = action.payload;
        },
        setMobileMode : (state, action) =>{
            state.mobileMode = action.payload
        }
    }
});

export const {setMaskAreaData,sendSignalforMaskResponse, sendSignalforButtonResponse, setMobileMode, setBandValues, setThresholdClass, setModelSelection, setModelThresHoldObject, setModelThresHoldValue , setDate } = addDetailsSlice.actions;
export default addDetailsSlice.reducer;