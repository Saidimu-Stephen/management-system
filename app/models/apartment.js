/** @format */

import mongoose, { Schema } from "mongoose";

const apartmentSchema = new Schema(
  {
    apartmentName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true } // Adding timestamps option
);

// Define compound unique index on apartmentName and location fields with a custom error message
apartmentSchema.index(
  { apartmentName: 1, location: 1 },
  {
    unique: true,
    message: "Apartment with the same name and location already exists.",
  }
);

const apartmentDetails =
  mongoose.models.Apartment || mongoose.model("Apartment", apartmentSchema);

export default apartmentDetails;
