import connectDB from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import MinorImage from "../../models/minorImageModel";
import MainImage from "@/app/models/mainImageModel";

export async function POST(req) {
  // Ensure the request is a POST request
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const { selectedRoomName } = await req.json();

    // Ensure database connection
    await connectDB();

  // Delete room images from the MainImage collection
    const mainImageDeleteResult = await MainImage.deleteOne({ selectedRoomName });

    // Delete room images from the MinorImage collection
    const minorImageDeleteResult = await MinorImage.deleteOne({ selectedRoomName });


    // Prepare messages for response
    const mainImageMessage = mainImageDeleteResult.deletedCount === 1
      ? "Main image deleted successfully"
      : "Main image not found";

    const minorImageMessage = minorImageDeleteResult.deletedCount === 1
      ? "Minor images deleted successfully"
      : "Minor images not found";

    // Return success response
    return NextResponse.json({
      message: "Image deletion operation completed",
      details: {
        mainImageMessage,
        minorImageMessage,
      },
    });

  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
