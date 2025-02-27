import { createSlice } from '@reduxjs/toolkit'

export const buttonSlice = createSlice({
    name: "button",
    initialState: {
        enableClasses: false,
        drawControl: false,
        drawClassControl: false,
        enableROI: true,
        
        showImageButton: true,
        imageButtonDisabled: false,
        segmentButtonDisabled: false,
        showModelThresholdButtons: false,
        showBandsDateButtons : true,
        developerState: 0,
        showDropDown : false,
        
        isLoading: false
    },
    reducers: {
        setDeveloper : (state,action)=>{
            state.developerState = action.payload;
        },
        changeButton: (state = initialState, action) => {
            const { type, payload } = action.payload;
            state[type] = payload;
            // console.log("Button state" , state[type]);
        },
        toggle: (state, action) => {
            const property = action.payload;
            if (property in state) {
                state[property] = !state[property];

            } else {
                console.error(`Property "${property}" does not exist in the state.`);
            }
        }

    }
})

export const { changeButton ,toggle, setDeveloper} = buttonSlice.actions;

export default buttonSlice.reducer