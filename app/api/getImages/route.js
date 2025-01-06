/** @format */

import connectDB from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import MinorImage from "../../models/minorImageModel";
import MainImage from "@/app/models/mainImageModel";

export async function POST(req) {
  if (req.method !== "POST") {
    return NextResponse.error({
      status: 405,
      message: "Method not allowed",
    });
  }

  try {
    await connectDB();
    const { selectedRoomName } = await req.json();

    //  collect main images
    const mainImage = await MainImage.find({
      selectedRoomName: selectedRoomName,
    });
    // fetch minor images
    const minorImages = await MinorImage.find({
      selectedRoomName: selectedRoomName,
    });

    if (mainImage.length === 0 || minorImages.length === 0) {
      return NextResponse.json({
        mainImage: null,
        minorImages: null,
        message: "No Images found in the database",
      });
    }
    return NextResponse.json({ mainImage, minorImages });
  } catch (error) {
    console.error(error);

    if (error instanceof mongoose.Error.ValidationError) {
      let errorList = [];
      for (let e in error.errors) {
        errorList.push(error.errors[e].message);
      }
      return NextResponse.json({ messages: errorList });
    } else if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json({ messages: ["Invalid ID provided."] });
    } else {
      return NextResponse.json({ messages: ["Internal Server Error."] });
    }
  }
}