/** @format */

import connectDB from "@/app/lib/mongodb";
import MinorImage from "../../models/minorImageModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  if (req.method === "POST") {
    try {
      await connectDB(); // Ensure database connection

      const { roomName } = await req.json(); // Access JSON data from the request body
      console.log(roomName);

      // Fetch minor images for the specified room from the database
      const minorImages = await MinorImage.find({
        selectedRoomName: roomName,
      });

      if (!minorImages) {
        return NextResponse.error({
          status: 404,
          message: "Minor images not found for the specified room",
        });
      }

      return NextResponse.json(minorImages); // Return fetched data as JSON response
    } catch (error) {
      console.error(error);
      return NextResponse.json({ msg: "Internal Server Error" }); // Return error response
    }
  } else {
    return NextResponse.error({ status: 405, message: "Method Not Allowed" }); // Return method not allowed response
  }
}
