import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ModelSelector from './settings/modelSelector.component';
import BandConfiguration from './settings/bandConfig.component';
import ThresholdSliders from './settings/thresholdSlider.component';
import DateSelector from './settings/dateSelector.component';
// import ReviseData from './settings/reviseData.component';
// import OpacitySlider from './Opacity/opacitySlider.component';
import { onModelChange } from '../../../store/Slices/ThresholdModelSlice/thresholdModelSlice';

const MLModelComponent = ({ mapInstance }) => {
  const dispatch = useDispatch();
  const classJsonData = useSelector((state) => state.classjsonData);
  const { showModelThresholdButtons, showBandsDateButtons } = useSelector((state) => state.buttonSlice);
  const {modelThreshold} = useSelector((state)=> state.thresholdModelSlice)
  const [selectedModel, setSelectedModel] = useState(modelThreshold?.model || "Default Model");
  const {maskResponseSignal} = useSelector((state)=>state.addDetailsSlice)
  console.log(selectedModel)

  const handleModelChange = (model)=>{
    setSelectedModel(model)
    dispatch(onModelChange(model));
    console.log('changed model' , model)
  }
  const handleMouseEnter = () => {
    if (mapInstance) {
      mapInstance.dragPan.disable(); // Disable map dragging
      mapInstance.scrollZoom.disable(); // Disable scroll zoom
    }
  };

  const handleMouseLeave = () => {
    if (mapInstance) {
      mapInstance.dragPan.enable(); // Enable map dragging
      mapInstance.scrollZoom.enable(); // Enable scroll zoom
    }
  };
  const {classname} = useSelector((state)=> state.thresholdModelSlice);
  //
  const [imageData, setImageData] = useState({
    ClassA: {
      opacity: 0.5,
      area: 150,
      region: { name: "RegionA" },
    },
    ClassB: {
      opacity: 0.7,
      area: 200,
      region: { name: "RegionB" },
    },
    ClassC: {
      opacity: 0.3,
      area: 100,
      region: { name: "RegionC" },
    },
  });


  const overlayIndex = 0;

  const handleSliderChange = (name, delta, overlayIndex) => {
    setImageData((prevData) => ({
      ...prevData,
      [name]: {
        ...prevData[name],
        opacity: Math.min(1, Math.max(0, prevData[name].opacity + delta)), // Clamp between 0 and 1
      },
    }));
  };

  const opacitySlider = true; 
  return (
    <div className="rounded-lg text-gray-100 "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {/* <h2 className="text-xl font-semibold mb-4 flex items-center">Settings </h2> */}

      <div className="space-y-4">

        {classJsonData.classjsonData.length > 0 &&
        <>
          <ModelSelector selectedModel={selectedModel} setSelectedModel={handleModelChange} />
          {selectedModel !== "Rain Forest Classifier" && selectedModel !== "Parallelopiped" &&
          <ThresholdSliders selectedModel={selectedModel} />}</>
        } 

        {showBandsDateButtons && classJsonData.classjsonData.length <= 0 &&
        <>
          <BandConfiguration />
          <DateSelector />
          </>}

        {/* {maskResponseSignal &&
        <OpacitySlider
          overlayIndex={overlayIndex}
          opacitySlider={opacitySlider}
          imageData={imageData}
          handleSliderChange={handleSliderChange}
        />
        }  */}
        {/* <ReviseData/> */}
        
      </div>
    </div>
  );
};

export default MLModelComponent;
