import connectDB from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import Room from "../../models/roomDetails"; // Import the Room model

import MinorImage from "../../models/minorImageModel";
import MainImage from "@/app/models/mainImageModel";


export async function POST(req) {
  // Ensure the request is a POST request
  if (req.method !== "POST") {
    return NextResponse.error({
      status: 405,
      message: "Method not allowed",
    });
  }

  try {
    const { selectedRoomName } = await req.json();

    // Ensure database connection
    await connectDB();

    // Delete room from the Room collection
    const roomDeleteResult = await Room.deleteOne({ roomName: selectedRoomName });

    // Delete room images from the MainImage collection
    const mainImageDeleteResult = await MainImage.deleteOne({ selectedRoomName });

    // Delete room images from the MinorImage collection
    const minorImageDeleteResult = await MinorImage.deleteOne({ selectedRoomName });

    // Check if any document was deleted from Room
    if (roomDeleteResult.deletedCount === 1) {
      // Check if related images were deleted
      const mainImageMessage = mainImageDeleteResult.deletedCount === 1 ? "Main image deleted" : "Main image not found";
      const minorImageMessage = minorImageDeleteResult.deletedCount === 1 ? "Minor images deleted" : "Minor images not found";

      // Return success response
      return NextResponse.json({
        message: "Room deleted successfully",
        details: {
          roomDeleted: true,
          mainImageMessage,
          minorImageMessage,
        },
      });
    } else {
      // If the room wasn't found, return a not found response
      return NextResponse.json({
        message: "Room not found",
        roomDeleted: false,
      });
    }
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json({
      message: "Server error",
      error: error.message,
    });
  }
}
