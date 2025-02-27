import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateThreshold, onModelChange } from "../../../../store/Slices/ThresholdModelSlice/thresholdModelSlice";

const ThresholdSliders = ({ selectedModel }) => {
  const dispatch = useDispatch();
  const { modelThreshold } = useSelector((state) => state.thresholdModelSlice);
  console.log("+++++++++++++++++++++++++", modelThreshold);

  // Update Redux state when selectedModel changes
  useEffect(() => {
    if (selectedModel) {
      console.log("Dispatching model change with model:", selectedModel);
      dispatch(onModelChange(selectedModel));
    }
  }, [selectedModel, dispatch]);

  const handleThresholdChange = (className, newValue) => {
    console.log("Updating Threshold:", { className, newValue });
    dispatch(updateThreshold({ className, newValue }));
  };

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="rounded-lg">
      <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-100">
        Threshold Frequency
      </h2>
      {Object.entries(modelThreshold.thresholds).map(([className, thresholdValue], index) => {
        // Set dynamic max value for the slider
        const max = className === "value" ? 15 : 10;
        const percentage = ((thresholdValue - 1) / (max - 1)) * 100;

        return (
          <div
            key={className}
            className="relative group mb-8"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="text-gray-200 font-medium mb-2">
              {className !== "value" && className}
            </div>
            <div className="relative">
              <input
                type="range"
                min={1}
                max={max}
                value={thresholdValue}
                onChange={(e) => handleThresholdChange(className, Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer focus:outline-none"
              />
              {hoveredIndex === index && (
                <div
                  className="absolute -top-8 bg-gray-800 text-white px-2 py-1 rounded text-xs font-semibold text-center transform -translate-x-1/2"
                  style={{ left: `${percentage}%` }}
                >
                  {thresholdValue}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ThresholdSliders;
