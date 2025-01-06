
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
    unique: true,
  },
  roomType: {
    type: String,
    required: true,
  },
  numberOfGuests: {
    type: String,
    required: true,
  },
  numberOfBeds: {
    type: String,
    required: true,
  },
  roomDescription: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  nameOfApartment: {
    type: String,
    required: true,
  },
});

const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);

export default Room; // Export the Room model as a default export

