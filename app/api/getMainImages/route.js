/** @format */

import connectDB from "@/app/lib/mongodb";
import MainImage from "../../models/mainImageModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  if (req.method === "GET") {
    try {
      await connectDB(); // Ensure database connection

      // Fetch all apartment details from the database
      const mainImage = await MainImage.find({});

      return NextResponse.json(mainImage); // Return fetched data as JSON response
    } catch (error) {
      console.error(error);
      return NextResponse.json({ msg: "Internal Server Error" }); // Return error response
    }
  } else {
    return NextResponse.error({ status: 405, message: "Method Not Allowed" }); // Return method not allowed response
  }
}
