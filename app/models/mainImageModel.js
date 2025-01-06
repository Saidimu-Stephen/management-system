/** @format */

import mongoose from "mongoose";

const mainImageSchema = new mongoose.Schema({
  selectedRoomName: {
    type: String,
    required: true,
    unique: true,
  },
  mainImage: {
    // data: Buffer, // Store the binary data of the image
    type: String,
    // contentType: String, // Store the content type of the image (e.g., image/jpeg)
    required: true,
  },
});

const MainImage =
  mongoose.models.MainImage || mongoose.model("MainImage", mainImageSchema);

export default MainImage;
