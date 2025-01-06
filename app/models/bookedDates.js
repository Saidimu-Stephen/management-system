/** @format */

import mongoose from "mongoose";

// Define schema for booked dates
const bookingSchema = new mongoose.Schema({
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  bookedDates: [
    {
      type: Date,
      required: true,
    },
  ],
  // You can add additional fields if needed, such as customer information
});

// Create model for booked dates
const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking; // Export the Booking model as a default export
