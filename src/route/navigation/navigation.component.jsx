import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogIn, UserPlus, Menu, X, Plus, ArrowRight, ArrowLeft } from 'lucide-react';
import { selectCurrentUser } from "../../store/user/user.selector";
import ROIdropdown from "../../components/dropdown/roiDropdown.component";
import ColorDropdown from "../../components/colorPalatteDropdown/colorDropdown.component";
import ClassDropdown from "../../components/dropdown/classDropdown.component";
import UserLog from "./userAndLogout.component";

const Navigation = () => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdownROI, setShowDropdownROI] = useState(false);
  const [showDropdownClass, setShowDropdownClass] = useState(false);
  const {developerState} =useSelector((state) =>state.buttonSlice)

  const currentUser = useSelector(selectCurrentUser);
  const { enableClasses, enableROI } = useSelector((state) => state.buttonSlice);
  const location = useLocation();

  const dropdownROIRef = useRef(null);
  const dropdownClassRef = useRef(null);

  const isAuthRoute = ["/auth/sign-in", "/auth/sign-up", "/forgot-password", "/imageUpload"].includes(location.pathname);

  useEffect(() => {
    const checkWidth = () => setIsMobileView(window.innerWidth <= 768);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownROIRef.current && !dropdownROIRef.current.contains(e.target)) {
        setShowDropdownROI(false);
      }
      if (dropdownClassRef.current && !dropdownClassRef.current.contains(e.target)) {
        setShowDropdownClass(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handlePlusClickROI = () => {
    if (!enableROI) return;
    setShowDropdownROI((prev) => !prev);
  };

  const handlePlusClickClass = () => {
    if (!enableClasses) return;
    setShowDropdownClass((prev) => !prev);
  };
  const navigate= useNavigate();
  const toggleMobileMenu = () => setShowMobileMenu((prev) => !prev);

  return (
    <nav className="bg-bg-color shadow-lg border-b border-gray-700">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-5">
          <div className="text-white" onClick={()=>navigate(-1)}>
            <ArrowLeft size={24}/>
          </div>
            <NavLink to="/" className="flex-shrink-0 flex items-center">
              <img src="/isro.avif" alt="logo" className="w-10 h-10 " />
              <span className="ml-2 text-white text-lg font-semibold hidden md:block">Vedas</span>
            </NavLink>
          </div>

          <div className="w-[200px]">
            <h1 className="text-white text-2xl font-extrabold">SATSAM</h1>
          </div>

          {/* {!isAuthRoute && (
            <div className="hidden md:block">
              <div className="flex items-center relative space-x-4">
                <div className="flex items-center space-x-2" ref={dropdownROIRef}>
                  <ROIdropdown />
                  <button
                    title="Add ROI"
                    onClick={handlePlusClickROI}
                    className="text-white relative hover:text-gray-300 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                  <ColorDropdown
                    showDropdown={showDropdownROI}
                    setShowDropdown={setShowDropdownROI}
                    isROI={true}
                  />
                </div>
                {developerState === 1 && (
                <div className=" relative flex items-center space-x-2" ref={dropdownClassRef}>
                  <ClassDropdown />
                  <button
                    title="Add Classes"
                    onClick={handlePlusClickClass}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                  <ColorDropdown
                    showDropdown={showDropdownClass}
                    setShowDropdown={setShowDropdownClass}
                    isROI={false}
                  />
                </div>

                )}
              </div>
            </div>
          )} */}

          <div className="hidden md:block">
            {/* <div className="flex items-center space-x-4">
              {currentUser ? (
                <UserLog />
              ) : (
                <>
                  <NavLink
                    to="/auth/sign-up"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors duration-200 ${
                        isActive ? "text-white" : "text-gray-300 hover:text-white"
                      }`
                    }
                  >
                    Register
                  </NavLink>
                  <span className="text-gray-400">or</span>
                  <NavLink
                    to="/auth/sign-in"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors duration-200 ${
                        isActive ? "text-white" : "text-gray-300 hover:text-white"
                      }`
                    }
                  >
                    Sign In
                  </NavLink>
                </>
              )}
            </div> */}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {showMobileMenu && !isAuthRoute && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2" ref={dropdownROIRef}>
                <ROIdropdown />
                <button
                  title="Add ROI"
                  onClick={handlePlusClickROI}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Plus size={20} />
                </button>
                <ColorDropdown
                  showDropdown={showDropdownROI}
                  setShowDropdown={setShowDropdownROI}
                  isROI={true}
                />
              </div>
              <div className="flex items-center space-x-2" ref={dropdownClassRef}>
                <ClassDropdown />
                <button
                  title="Add Classes"
                  onClick={handlePlusClickClass}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Plus size={20} />
                </button>
                <ColorDropdown
                  showDropdown={showDropdownClass}
                  setShowDropdown={setShowDropdownClass}
                  isROI={false}
                />
              </div>
            </div>
          </div>
          {/* {!currentUser && (
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5 space-x-3">
                <NavLink
                  to="/auth/sign-up"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive ? "text-white" : "text-gray-300 hover:text-white"
                    }`
                  }
                >
                  Register
                </NavLink>
                <NavLink
                  to="/auth/sign-in"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive ? "text-white" : "text-gray-300 hover:text-white"
                    }`
                  }
                >
                  Sign In
                </NavLink>
                
              </div>
            </div>
          )} */}
        </div>
      )}
      <Outlet />
    </nav>
  );
};

export default Navigation;

