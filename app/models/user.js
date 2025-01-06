// User schema

import mongoose, { Schema } from "mongoose"


const userSchema = new Schema({
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    nationality: { type: String, required: true },
    passportId: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    password: { type: String, required: true },
  });
  
const user =
mongoose.models.User || mongoose.model("User", userSchema);

export default user;