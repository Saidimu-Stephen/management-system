/** @format */

import React from "react";

function GoogleRegister() {
  const handleGoogleLogin = () => {
    console.log("Handle Google login");
    // Your Google authentication logic here...
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Register with Google</h1>

      <button
        className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md shadow-md focus:outline-none hover:bg-red-700"
        onClick={handleGoogleLogin}>
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.538 12.852H12v4.296h6.307c-.605 1.877-2.127 3.249-4.068 3.913v3.29h6.582c3.861-3.567 3.817-10.503 0-14.499z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 21.148c-3.178 0-5.861-1.72-7.348-4.065l-1.511.893c2.141 4.317 6.364 7.225 11.161 7.225 4.373 0 8.223-2.44 10.178-6.036l-1.849-1.292c-1.348 2.208-3.888 3.678-6.76 3.678z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 21.148c-2.872 0-5.412-1.47-6.76-3.678l-1.849 1.292c1.954 3.597 5.805 6.036 10.178 6.036 4.797 0 9.02-2.908 11.161-7.225l-1.511-.893c-1.487 2.345-4.17 4.065-7.348 4.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 21.148V12M12 12c2.722 0 5.222-1.453 6.584-3.84"
          />
        </svg>
        Continue with Google
      </button>
    </div>
  );
}

export default GoogleRegister;
