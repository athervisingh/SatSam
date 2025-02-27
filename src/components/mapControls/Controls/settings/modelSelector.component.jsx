import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown } from 'lucide-react';
// import { setModelSelection } from '../../../../store/Slices/AdditionalDetailsSlice/addDetailsSlice';

const ModelSelector = ({ selectedModel, setSelectedModel }) => {
  // const dispatch = useDispatch();
  const models = ['Mahalanobis Model', 'Maximum Likelyhood Classifier', 'Rain Forest Classifier', 'Parallelopiped'];
  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
    // dispatch(setModelSelection(e.target.value));
    // dispatch(onModelChange(e.target.value))
    
  }

  return (
    <>
    <h2 className="text-xl font-semibold mb-4 flex items-center">Model Configuration </h2>
    <div className="relative">
     

      <select
        value={selectedModel}
        onChange={handleModelChange}
        className=" appearance-none bg-gray-700 text-white p-2 rounded w-full pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
    </>
  );
};

export default ModelSelector;
