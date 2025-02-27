import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setBandValues } from '../../../../store/Slices/AdditionalDetailsSlice/addDetailsSlice';

const BandConfiguration = () => {
  const options = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B10', 'B11', 'B12'];
  const [dropdown1, setDropdown1] = useState('B4');
  const [dropdown2, setDropdown2] = useState('B3');
  const [dropdown3, setDropdown3] = useState('B2');
  const dispatch = useDispatch();

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        Band Configurations
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {[dropdown1, dropdown2, dropdown3].map((value, index) => (
          <div key={index} className="relative">
            <select
              value={value}
              onChange={(e) => {
                const setters = [setDropdown1, setDropdown2, setDropdown3];
                setters[index](e.target.value);

                dispatch(setBandValues({ bandkey: `band${index + 1}`, value: e.target.value }));
              }}
              className="appearance-none bg-gray-700 text-white p-2 rounded w-full pr-8 focus:outline-none focus:ring-2 focus:ring-button-select-color"
            >
              {options.map((option) => (
                <option key={option} value={option} >
                  {option}
                </option>
              ))}
            </select> 
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        ))}
      </div>
    </>
  );
};

export default BandConfiguration;
