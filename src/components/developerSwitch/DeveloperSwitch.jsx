import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDeveloper } from '../../store/Slices/ButtonSlice/buttonSlice';
import { useNavigate } from 'react-router-dom';

const DeveloperSwitch = ({ isMobileView }) => {
  const { developerState } = useSelector((state) => state.buttonSlice);
  const dispatch = useDispatch();

  const handleSwitchDeveloper = (num) => {
    dispatch(setDeveloper(num));
  };

  // Developer mode labels
  const developerModes = ['Non-tech', 'Tech', 'SAM-2'];
  
  if (isMobileView) return null;
  const {imageResponseSignal} = useSelector((state)=>state.addDetailsSlice)
  return (
    <div 
      className="w-[14rem] fixed right-16 top-4 z-[5000] bg-[#212529] rounded-lg p-4 shadow-2xl border border-[#374151]"
      title="Developer Mode"
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="text-xs font-medium text-gray-300 mb-2">
          Developer Mode: {developerModes[developerState]}
        </div>
        
        <div className="w-full relative flex items-center space-x-4">
          {/* Custom track */}
          <div className="w-full h-2 bg-[#374151] rounded-full relative overflow-hidden">
            {/* Active track */}
            <div 
              className="absolute left-0 top-0 h-full bg-[#374151] transition-all duration-300 ease-in-out"
              style={{ 
                width: `${(developerState / 2) * 100}%` 
              }}
            />
          </div>

          {/* Custom thumb */}
          <input
            type="range"
            min={0}
            max={2}
            step={1}
            value={developerState}
            disabled={imageResponseSignal}
            onChange={(e) => handleSwitchDeveloper(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
          />
          
          {/* Thumb marker */}
          <div 
            className="absolute transition-all duration-300 ease-in-out rounded-full shadow-lg bg-[#0d9488] w-5 h-5"
            style={{ 
              left: `calc(${(developerState / 2) * 85}% - 10px)`,
            }}
          />
        </div>

        {/* Mode labels */}
        <div className="flex justify-between w-full text-xs text-gray-400 mt-2">
          {developerModes.map((mode, index) => (
            <span 
              key={mode} 
              className={`
                transition-all duration-300 
                ${developerState === index 
                  ? 'font-bold text-[#0d9488]' 
                  : 'text-gray-500'
                }
              `}
              onClick={()=>handleSwitchDeveloper(index)}
            >
              {mode}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeveloperSwitch;