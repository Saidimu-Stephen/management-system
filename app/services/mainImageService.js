/** @format */

import { NextResponse } from "next/server";
import connectDB from "../lib/mongodb";
import MainImage from "../models/mainImageModel";

export async function saveMainImage(selectedRoomName, mainImage) {
  try {
    await connectDB();

    await MainImage.create({
      selectedRoomName,
      mainImage,
    });
    // console.log("Main image saved successfully");

    return NextResponse.json({
      success: true,
      message: ["Main image saved succesfully"],
    });
  } catch (error) {
    console.error("Error saving main image:", error.message);

    return NextResponse.json({
      success: false,
      message: ["Unable to save main image"],
    });
  }
}
