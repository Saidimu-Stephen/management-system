/** @format */

import connectDB from "@/app/lib/mongodb";
import apartmentDetails from "../../models/apartment";
import { NextResponse } from "next/server";

export async function GET(req) {
  if (req.method === "GET") {
    try {
      await connectDB(); // Ensure database connection

      // Fetch all apartment details from the database
      const apartments = await apartmentDetails.find({});

      return NextResponse.json(apartments); // Return fetched data as JSON response
    } catch (error) {
      console.error(error);
      return NextResponse.json({ msg: "Internal Server Error" }); // Return error response
    }
  } else {
    res.status(405).json({ msg: "Method Not Allowed" }); // Return method not allowed response
  }
}
