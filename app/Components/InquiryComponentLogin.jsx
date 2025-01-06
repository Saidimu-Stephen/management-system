/** @format */

import React from "react";

const InquiryComponent = () => {
  const handleResponse = () => {
    // Redirect to login page when the "Register" button is clicked
    window.location.href = "/login"; // Replace '/login' with your login page route
  };

  return (
    <div className="text-center mt-4 mb-4">
      <h2 className="text-lg font-semibold mb-4">Do you have an account?</h2>
      <button
        onClick={handleResponse}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Login
      </button>
    </div>
  );
};

export default InquiryComponent;
