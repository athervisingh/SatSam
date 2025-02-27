import React from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPopup({ handleClose }) {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/auth/sign-in');
    handleClose(false);
  };

  const handleSignUp = () => {
    navigate('/auth/sign-up');
    handleClose(false);
  };

  return (
    <>
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md z-[6000] transition-opacity"
        onClick={() => handleClose(false)}
        aria-hidden="true"
      />
      
      {/* Popup Modal */}
      <div
        className="fixed inset-0 flex items-center justify-center z-[6001] transition-all transform scale-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-gray-800 text-white rounded-lg shadow-2xl w-full max-w-[26rem] mx-4 animate-fadeIn">
          {/* Header */}
          <div className="relative p-6 border-b border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 text-teal-400">Action Required</h2>
            <p className="text-gray-400 text-sm">You need to sign in to post content. Please sign in or create an account to continue.</p>
            <button
              onClick={() => handleClose(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="p-6 space-y-4">
            <button
              onClick={handleSignIn}
              className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Sign Up
            </button>
            <button
              onClick={() => handleClose(false)}
              className="w-full py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
