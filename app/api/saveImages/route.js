/** @format */

import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import MainImage from "@/app/models/mainImageModel";
import MinorImage from "@/app/models/minorImageModel";

// Main image saving service
async function saveMainImage(selectedRoomName, mainImage) {
	try {
		await connectDB();

		await MainImage.create({
			selectedRoomName,
			mainImage,
		});

		return { success: true, message: ["Main image saved successfully"] };
	} catch (error) {
		console.error("Error saving main image:", error.message);
		return { success: false, message: ["Unable to save main image"] };
	}
}

// Minor images saving service
async function saveMinorImages(selectedRoomName, minorImages) {
	try {
		await connectDB();

		const minorImageObject = new MinorImage({
			selectedRoomName,
			minorImages,
		});

		await minorImageObject.save();
		return { success: true };
	} catch (error) {
		console.error("Error saving minor image:", error.message);
		return { success: false };
	}
}

// Main API Endpoint
export async function POST(req) {
	try {
		await connectDB();

		const { selectedRoomName, mainImage, minorImages } = await req.json();

		// Save the main image
		const mainImageResponse = await saveMainImage(selectedRoomName, mainImage);

		// Save the minor images
		const minorImageResponse = await saveMinorImages(
			selectedRoomName,
			minorImages
		);

		// Check if both main image and minor images saving failed
		if (!mainImageResponse.success) {
			return NextResponse.json({ messages: ["Failed to save main image."] });
		} else if (!minorImageResponse.success) {
			return NextResponse.json({ messages: ["Failed to save minor images."] });
		}

		// All images saved successfully
		return NextResponse.json({ messages: ["Images saved successfully."] });
	} catch (error) {
		console.error("Error:", error.message);

		if (error instanceof mongoose.Error.ValidationError) {
			let errorList = [];
			for (let e in error.errors) {
				errorList.push(error.errors[e].message);
			}
			console.log(errorList);
			return NextResponse.json({ messages: errorList });
		} else if (error instanceof mongoose.Error.CastError) {
			return NextResponse.json({ messages: ["Invalid ID provided."] });
		} else if (error.code === 11000 || error.code === 11001) {
			return NextResponse.json({ messages: ["Duplicate key error."] });
		} else if (error.code === 11600) {
			return NextResponse.json({ messages: ["Chunk error."] });
		} else {
			return NextResponse.json({ messages: ["Unable to save images."] });
		}
	}
}
