import React, { useState } from 'react';
import InputTab from './geojsonTabs/inputTab.component';
import OutputTab from './geojsonTabs/outputTab.component';

const GeoJSONTabManager = () => {
  const [activeTab, setActiveTab] = useState('output');

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-700">
          <button 
            onClick={() => setActiveTab('input')}
            className={`flex-1 py-3 text-sm font-semibold tracking-wider uppercase transition-all duration-300 ease-in-out ${
              activeTab === 'input'
                ? 'bg-button-select-color text-white border-b-2 border-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            }`}
          >
            Input
          </button>
          <button 
            onClick={() => setActiveTab('output')}
            className={`flex-1 py-3 text-sm font-semibold tracking-wider uppercase transition-all duration-300 ease-in-out ${
              activeTab === 'output'
                ? 'bg-button-select-color text-white border-b-2 border-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            }`}
          >
            Output
          </button>
        </div>

        <div className="bg-bg-color rounded-b-xl h-full">
          {activeTab === 'input' ? (
            <InputTab />
          ) : (
            <OutputTab />
          )}
        </div>
      </div>
    </div>
  );
};

export default GeoJSONTabManager;