import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClassData, setDropdownData } from "../../store/Slices/DataSlice/dataSlice";
import { changeButton } from "../../store/Slices/ButtonSlice/buttonSlice";
// import { addPropClassPolygon } from "../../store/Slices/ClassjsonSlice/classjsonSlice";
import {addClassProperties} from '../../store/Slices/ClassjsonSlice/classjsonSlice';
import { addClass, setCurrentClass } from "../../store/Slices/ThresholdModelSlice/thresholdModelSlice";

const ClassDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const dispatch = useDispatch();
    const { classdata } = useSelector((state) => state.dataSlice);
    const { enableClasses } = useSelector((state) => state.buttonSlice);
    

    useEffect(() => {
        dispatch(getClassData());
    }, []);
    
    const handleSelect = (value, name) => {
        // console.log("1111111111111111111111111111111111", value, "  " , name)
        // dispatch(setDropdownData({ value: value, name: name, index: 1 }));
        dispatch(addClassProperties({class: name, fill : value}))
        // dispatch(addPropClassPolygon({ value: value, name: name }));

        setSelectedItem({ name: name, value: value });
        setIsOpen(false);
        dispatch(changeButton({ type: "drawControl", payload: true }));
        dispatch(setCurrentClass(name));
    };

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                className="inline-flex justify-between items-center w-full px-4 py-2 text-sm font-bold text-white rounded-md shadow-sm focus: outline-none"
                onClick={() => {
                    if(!enableClasses) return;
                    setIsOpen((prev) => !prev);
                }}
            >
                {selectedItem ? selectedItem.name : "Select Classes"}
                <svg
                    className={`w-5 h-5 ml-2 transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.67l3.71-3.44a.75.75 0 111.04 1.08l-4 3.75a.75.75 0 01-1.04 0l-4-3.75a.75.75 0 01-.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-[1001] mt-2 w-full rounded-md bg-white shadow-lg">
                    <ul className="py-1 text-sm text-gray-700 max-h-40 overflow-y-auto">
                        {classdata?.map((item, index) => (
                            <li
                                key={index}
                                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                onClick={() => handleSelect(item.value, item.name)}
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ClassDropdown;
