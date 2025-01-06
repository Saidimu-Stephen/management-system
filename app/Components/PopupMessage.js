/** @format */

// PopupMessage.js

import React from "react";

const PopupMessage = ({ message, onClose }) => {
  return (
    <div className='fixed z-50 bg-white flex flex-col items-center p-4 rounded-lg border border-red-300 animate-bounce'>
      <p className='text-2xl font-semibold'>Alert!!</p>
      <p className='text-red-500 font-serif font-bold text-3xl'>{message}</p>
      <button
        className='absolute top-0 right-0 mt-1 mr-1 text-sm text-gray-500 hover:text-gray-700'
        onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default PopupMessage;
