/** @format */

import connectDB from "../lib/mongodb";
import MinorImage from "../models/minorImageModel";
import { NextResponse } from "next/server";

export async function saveMinorImages(selectedRoomName, minorImages) {
  try {
    await connectDB();

    // Create the minor image object with selectedRoomName and minorImages array
    const minorImageObject = new MinorImage({
      selectedRoomName,
      minorImages,
    });

    // Save the minor image object to the database
    await minorImageObject.save();

    // Return success response without a message
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving minor image:", error.message);

    // Return failure response without a message
    return NextResponse.json({ success: false });
  }
}
