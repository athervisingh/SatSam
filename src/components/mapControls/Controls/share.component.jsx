import React from 'react';

const ShareContent = () => {
  return (
    <div className="p-4 bg-[#212529] rounded-lg shadow w-64">
   
      
      <div className="mb-4">
        <div className="flex justify-between mb-2">
        <h2 className="text-lg font-bold mb-4">Date</h2>
        </div>
        <div className="flex gap-2 bg-[#212529]">
          <input 
            type="text" 
            className="border rounded bg-[#212529] p-2 w-full text-sm" 
            defaultValue="12/02/2025" 
          />
          <input 
            type="text" 
            className="border rounded bg-[#212529] p-2 w-full text-sm" 
            defaultValue="27/02/2025" 
          />
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between mb-2">
        <h2 className="text-lg font-bold mb-4">Bands</h2>
        </div>
        <div className="flex gap-2">
          <select className="border bg-[#212529] rounded p-2 w-full text-sm">
            <option>NIR</option>
          </select>
          <select className="border bg-[#212529] rounded p-2 w-full text-sm">
            <option>Red</option>
          </select>
          <select className="border bg-[#212529] rounded p-2 w-full text-sm">
            <option>Green</option>
          </select>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
        <h2 className="text-lg font-bold mb-4">Saturation</h2>
        </div>
        <div className="flex gap-2">
          <select className="border rounded bg-[#212529] p-2 w-full text-sm">
            <option>0.35</option>
          </select>
          <select className="border rounded p-2 bg-[#212529] w-full text-sm">
            <option>0.3</option>
          </select>
          <select className="border rounded p-2 bg-[#212529] w-full text-sm">
            <option>0.3</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ShareContent;