import React, { useState } from 'react'
import { getClassData, getROIdata } from '../../store/Slices/DataSlice/dataSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

const ColorDropdown = ({ showDropdown , setShowDropdown, isROI }) => {
    const [selectedColor, setSelectedColor] = useState("");
    const [name, setName] = useState("");
    const dispatch = useDispatch();

    const colors = [
        { name: "Red", hex: "#FF0000" },
        { name: "Green", hex: "#00FF00" },
        { name: "Blue", hex: "#0000FF" },
        { name: "Yellow", hex: "#FFFF00" },
        { name: "Cyan", hex: "#00FFFF" },
        { name: "Magenta", hex: "#FF00FF" },
        { name: "Orange", hex: "#FFA500" },
        { name: "Purple", hex: "#800080" },
        { name: "Pink", hex: "#FFC0CB" },
        { name: "Brown", hex: "#A52A2A" },
        { name: "Gray", hex: "#808080" },
        { name: "Black", hex: "#000000" },
        { name: "White", hex: "#FFFFFF" },
    ];

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const setToLocalStorage = () => {
        const area_name = name.trim();

        if(!area_name) return;

        // console.log(area_name , selectedColor)

        let local_data = JSON.parse(localStorage.getItem(isROI === true ? "roi_data" : "class_data"))

        if(local_data !== null) Object.assign(local_data , {[area_name] : selectedColor});
        else local_data = {[area_name] : selectedColor};

        localStorage.setItem(isROI === true ? "roi_data" : "class_data" , JSON.stringify(local_data));
        toast.info(`${area_name} added...`)

        dispatch(getROIdata());
        dispatch(getClassData());
    }

    return (
        <div>
            {showDropdown && (
                <div className={`absolute top-11 left-0 bg-[#212529] p-4 shadow-lg rounded-md z-[1001] w-[160px] 
                ${showDropdown ? "animate-slideDown" : "animate-slideUp"}
              `}
                >
                    <input type="text" name="ROI" id="ROIName" value={name} placeholder="Enter Name" onChange={handleNameChange} className="w-full border border-stone-700 focus:outline-none rounded mb-3 bg-[#212529] text-white p-1" />

                    <div className="flex flex-col gap-2 mb-3 h-40 overflow-y-scroll py-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        {colors.map((color) => (
                            <div
                                key={color.name}
                                className={`flex items-center gap-2 p-1 rounded-md mx-2 ${selectedColor === color.hex ? "bg-white" : ""
                                        }`}
                            >
                                <div
                                    className={` w-3 h-3 rounded-full cursor-pointer border ${selectedColor === color.hex ? "border-black" : ""
                                        }`}
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                    onClick={() => handleColorSelect(color.hex)}
                                ></div>
                                <span className={`text-sm cursor-pointer ${selectedColor === color.hex ? "text-black" : "text-white"}`} onClick={() => handleColorSelect(color.hex)}>{color.name}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        className={`w-full py-2 rounded bg-blue-500 text-white ${name && selectedColor
                            ? "hover:bg-blue-700"
                            : "opacity-50 cursor-not-allowed"
                            }`}
                        disabled={!name || !selectedColor}
                        onClick={() => {
                            setToLocalStorage();
                            setShowDropdown(false)
                        }}
                    >
                        Enter
                    </button>
                </div>
            )}
        </div>
    )
}

export default ColorDropdown
