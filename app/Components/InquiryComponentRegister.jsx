/** @format */

import React, { useState } from "react";

const InquiryComponent = () => {
  const [hasAccount, setHasAccount] = useState(null);

  const handleResponse = (response) => {
    setHasAccount(response);
    // Perform actions based on the user's response here
    if (response === "no") {
      // User doesn't have an account, take appropriate action
      // Example: Redirect to signup page
      window.location.href = "/register"; // Replace '/signup' with your signup page route
    }
    // You can perform other actions based on the response
  };

  return (
    <div className="text-center mt-4 mb-4">
      <h2 className="text-lg font-semibold mb-4">Do you have an account?</h2>
      <button
        onClick={() => handleResponse("no")}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Register
      </button>
      {hasAccount !== null && (
        <p className="mt-4">
          You answered: {hasAccount === "no" ? "No" : "Yes"}. Redirecting...
        </p>
      )}
    </div>
  );
};

export default InquiryComponent;
