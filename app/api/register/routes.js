/** @format */

import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/users";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Handles POST request to register a new user using form data.
 * @param {Object} req - HTTP request object containing form data
 * @returns {Object} JSON response indicating success or error
 */
export async function POST(req) {
  if (req.method !== "POST") {
    return NextResponse.error({
      status: 405,
      message: "Method Not Allowed",
    });
  }

  const formData = await req.json();
  const {
    username,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    nationality,
    passportId,
    phoneNumber,
    email,
    street,
    city,
    state,
    zipCode,
    country,
    password,
    confirmPassword
  } = formData;

  // Validate passwords match
  if (password !== confirmPassword) {
    return NextResponse.json({
      msg: ["Passwords do not match"],
      success: false,
    });
  }

  try {
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        msg: ["User already exists"],
        success: false,
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user with the provided form data
    await User.create({
      username,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      nationality,
      passportId,
      phoneNumber,
      email,
      address: {
        street,
        city,
        state,
        zipCode,
        country,
      },
      password: hashedPassword,
    });

    return NextResponse.json({
      msg: ["User registered successfully"],
      success: true,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      let errorList = [];
      for (let e in error.errors) {
        errorList.push(error.errors[e].message);
      }
      return NextResponse.json({ msg: errorList });
    } else {
      return NextResponse.json({ msg: ["Unable to register user."] });
    }
  }
}
