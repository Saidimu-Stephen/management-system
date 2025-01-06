/** @format */

import connectDB from "@/app/lib/mongodb";
import ApartmentDetails from "../../models/apartment";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  if (req.method === "POST") {
    try {
      const { apartmentName, location } = await req.json();
      // console.log(res.json());
      await connectDB();
      await ApartmentDetails.create({
        apartmentName,
        location,
      });

      return NextResponse.json({
        msg: "Apartment details saved successfully",
      });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        let errorList = [];
        for (let e in error.errors) {
          errorList.push(error.errors[e].message);
        }
        console.error(errorList);
        return NextResponse.json({ msg: errorList }); // Return validation error response
      } else {
        console.error(error.message);
        return NextResponse.json({ msg: "Unable to save apartment details" }); // Return generic error response
      }
    }
  } else {
    return NextResponse.json({ msg: "Method Not Allowed" }); // Return method not allowed response
  }
}
