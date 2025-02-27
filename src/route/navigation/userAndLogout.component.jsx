import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, ChevronRight, Pen } from "lucide-react";
import { signOutUser } from "../../utils/firebase/firebase.utils";
import { FaGlobe } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { changeButton } from "../../store/Slices/ButtonSlice/buttonSlice";

const UserLog = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  // const {developerState} = useSelector((state) => state.buttonSlice);
  const dispatch = useDispatch();
  const handleSignOut = () => {
    signOutUser();
    dispatch(setDeveloper(0))
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const dropdownItems = [
    {
      icon: FaGlobe,
      text: "Community",
      subtext: "Join discussions and connect",
      onClick: () => console.log("Community clicked"),
    },
    {
      icon: RiTeamFill,
      text: "About Us",
      subtext: "Learn more about us",
      onClick: () => console.log("About Us clicked"),
    },
    {
      icon: LogOut,
      text: "Sign Out",
      destructive: true,
      onClick: handleSignOut,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="
          flex items-center justify-center 
          w-10 h-10 rounded-full 
          bg-gradient-to-r from-indigo-500 to-purple-600 
          text-white hover:from-indigo-600 hover:to-purple-700 
          transition-all duration-300 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
          shadow-lg hover:shadow-xl
          active:scale-95
        "
        onClick={() => setDropdownOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        {userImage ? (
          <img src={userImage} alt="User" className="w-full h-full object-cover rounded-full" />
        ) : (
          <User size={24} />
        )}
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="
              absolute right-0 mt-3 w-64 
              bg-white rounded-2xl 
              shadow-2xl z-[1001] 
              overflow-hidden 
              border border-gray-200
              divide-y divide-gray-100
            "
          >
            <div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div
                  className="
                  w-12 h-12 rounded-full 
                  bg-gradient-to-r from-indigo-400 to-purple-500 
                  flex items-center justify-center
                  text-white
                  relative
                  group
                  cursor-pointer
                "
                  onClick={triggerFileInput}
                >
                  {userImage ? (
                    <img src={userImage} alt="User" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <User size={24} />
                  )}
                  <div
                    className="
                    absolute inset-0 bg-black bg-opacity-50 
                    rounded-full flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity
                  "
                  >
                    <Pen size={16} className="text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">User Profile</p>
                  <p className="text-xs text-gray-500 truncate">user@example.com</p>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div className="py-1">
              {dropdownItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`
                    flex items-center w-full px-4 py-3 text-sm 
                    hover:bg-gray-100 transition-colors duration-200 
                    group relative
                    ${item.destructive ? "text-red-600 hover:bg-red-50" : "text-gray-700"}
                  `}
                >
                  <item.icon
                    size={18}
                    className={`
                    mr-3 
                    ${item.destructive ? "text-red-500" : "text-gray-500"} 
                    group-hover:scale-110 transition-transform
                  `}
                  />
                  <div className="flex-grow text-left">
                    <div className="font-medium">{item.text}</div>
                    {item.subtext && (
                      <p className="text-xs text-gray-500 mt-1">{item.subtext}</p>
                    )}
                  </div>

                  {item.hasSubMenu && (
                    <ChevronRight
                      size={18}
                      className="text-gray-400 group-hover:translate-x-1 transition-transform"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserLog;
