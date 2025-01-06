/** @format */

import connectDB from "@/app/lib/mongodb";
import Room from "../../models/roomDetails"; // Import the Room model
import { NextResponse } from "next/server";

export async function POST(req) {
  if (req.method !== "POST") {
    return NextResponse.error({
      status: 405,
      message: "Method not allowed",
    });
  }

  try {
    await connectDB(); // Ensure database connection

    // Extract the apartmentName from the request body
    const { Apartment_Name } = await req.json(); // Destructure Apartment_Name

    // console.log("apartment name:", Apartment_Name);

    // Fetch room details based on the apartmentName
    const rooms = await Room.find({ nameOfApartment: Apartment_Name });

    // console.log(rooms)

    return NextResponse.json(rooms); // Return fetched data as JSON response
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Internal Server Error" }); // Return error response
  }
}
