import React, { useState, useRef } from "react";
import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import '../mapControls.css';
import { ChevronDown, ChevronUp, MapPin, Trash2, X } from "lucide-react";


const MarkerManager = ({ markers, setMarkers }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ note: "", summary: "" });
  const [location, setLocation] = useState(null);
  const sidebarRef = useRef(null);
  const [openIndexes, setOpenIndexes] = useState({}); // Track which markers are expanded
  const map = useMap();
  const toggleDropdown = (index) => {
    setOpenIndexes((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  const goToLocation = (marker) =>{
    map.flyTo([marker.location.lat, marker.location.lng] , 16, {duration: 4});
  }

  useMapEvents({
    click(e) {
      if (
        isAdding &&
        e.latlng &&
        (!sidebarRef.current || !sidebarRef.current.contains(e.originalEvent.target))
      ) {
        setLocation(e.latlng);
      }
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (location) {
      setMarkers([...markers, { location, ...formData }]);
      setFormData({ note: "", summary: "" });
      setLocation(null);
      setIsAdding(false);
    }
  };

  const handleAddMarker = () => {
    setIsAdding(prev => !prev);
  };

  const deleteMarker = (index) => {
    setMarkers(prevMarkers => prevMarkers.filter((_, i) => i !== index));
    setOpenIndexes(prev => {
      const newOpenIndexes = { ...prev };
      delete newOpenIndexes[index];
      return newOpenIndexes;
    });
  };
  return (
    <div
      ref={sidebarRef}
      className="z-[4000] sidebar bg-bg-color rounded-sm max-w-md overflow-hidden h-[80vh]"
    >
      <div className="">
        <h2 className="text-xl font-bold text-white mb-2">Marker Manager</h2>

        {location && location.lat !== undefined && location.lng !== undefined && (
          <Marker key="tmp-marker" position={[location.lat, location.lng]}>
            <Popup className="custom-popup">
              <div className="bg-bg-color text-white p-2 rounded-md">
                <h3 className="font-semibold mb-1">Temporary Marker</h3>
                <p className="text-sm">Click "Add Marker" to save this location.</p>
              </div>
            </Popup>
          </Marker>
        )}

        
          {!isAdding ? (
            <button
              key="create-button"
              className="w-full bg-button-select-color text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-300 shadow-md"
              onClick={handleAddMarker}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              Create Marker
            </button>
          ) : (
            <form
            key="add-form"
            onSubmit={handleFormSubmit}
            className="bg-button-color p-3 rounded-xl shadow-lg relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            
            <div className="mb-3">
            <button className="absolute top-0 right-0 p-3" onClick={handleAddMarker}>
              <X/>
            </button>
              <label className="text-white block text-lg font-semibold mb-1">Note</label>
              <input
                type="text"
                className="w-full p-3 rounded-md bg-bg-color text-white focus:ring-2 focus:ring-button-select-color focus:outline-none transition-shadow duration-300"
                placeholder="Enter your note here..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="text-white block text-lg font-semibold mb-1">Summary</label>
              <input
                type="text"
                className="w-full p-3 rounded-md bg-bg-color text-white focus:ring-2 focus:ring-button-select-color focus:outline-none transition-shadow duration-300"
                placeholder="Enter a brief summary..."
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-button-select-color to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-indigo-500 hover:to-indigo-400 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Add Marker
            </button>
         
            </form>
          )}
          
      </div>

      <div className="mt-6 bg-bg-color rounded-lg shadow-lg w-full ">
        <h3 className="text-white font-bold mb-4 text-xl flex items-center">
          <MapPin className="mr-2 text-button-select-color" />
          Markers
        </h3>
        <div className={`space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-custom w-full p-2 ${isAdding? 'h-[30vh]':''}`}>
            {markers.map((marker, index) => (
              <div
                key={index}
                className="bg-button-color text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex justify-between items-center p-3">

                  <div
                    className="cursor-pointer flex-grow flex justify-between items-center "
                    onClick={() => toggleDropdown(index)}
                  >
                    <p className="font-semibold text-sm truncate mr-2 uppercase text-ellipsis w-[120px]">{marker.note}</p>
                    <button
                      className="text-sm  px-1 py-1 rounded-full flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {openIndexes[index] ? (                        
                          <ChevronUp  size={18} />                                            
                      ) : (
                          <ChevronDown  size={18} />                      
                      )}
                    </button>
                  </div>
                  <button
                    className="ml-2 text-teal-500 hover:text-teal-700 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={()=>goToLocation(marker)}
                  >
                    <MapPin size={20} />
                  </button>
                  <button
                    className="ml-2 text-red-500 hover:text-red-400 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteMarker(index)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                  {openIndexes[index] && (
                    <div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-3 pb-3"
                    >
                      <div className="bg-bg-color rounded-lg p-3 space-y-2">
                        <p className="text-sm break-words whitespace-normal truncate">
                          <span className="font-semibold text-button-select-color ">Note:</span>{" "}
                          {marker.note}
                        </p>
                        <p className="text-sm break-words whitespace-normal truncate text-ellipsis">
                          <span className="font-semibold text-button-select-color ">Summary:</span>{" "}
                          {marker.summary}
                        </p>
                        <p className="text-sm break-words whitespace-normal truncate text-ellipsis">
                          <span className="font-semibold text-button-select-color">Location:</span>{" "}
                          [{marker.location.lat.toFixed(4)}, {marker.location.lng.toFixed(4)}]
                        </p>
                      </div>
                    </div>
                  )}
                
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MarkerManager;