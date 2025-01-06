/** @format */

// Import necessary modules and models
import mongoose from "mongoose";
import connectDB from "@/app/lib/mongodb";
import Room from "../../models/roomDetails";
import { NextResponse } from "next/server";

// Handle POST requests to create a new room
export async function POST(req) {
	// Check if the request method is POST
	if (req.method === "POST") {
		try {
			// Parse the JSON data from the request body
			const { updatedFormData } = await req.json();
			// Uncomment the next line if you want to log the received data
			// console.log(updatedFormData);

			// Connect to the MongoDB database
			await connectDB();

			// Create a new room with the provided data
			const newRoom = await Room.create(updatedFormData);

			// Return a success response with the created room data
			return handleSuccessResponse(newRoom);
		} catch (error) {
			// Handle any errors that occur during room creation
			return handleErrorResponse(error);
		}
	} else {
		// If the request method is not POST, return a method not allowed response
		return handleMethodNotAllowed();
	}
}

// Function to handle a successful room creation response
function handleSuccessResponse(newRoom) {
	return NextResponse.json({
		msg: "Room created successfully",
		data: newRoom,
		success: true,
	});
}

// Function to handle errors that occur during room creation
// Function to handle errors that occur during room creation
function handleErrorResponse(error) {
	if (error instanceof mongoose.Error.ValidationError) {
		// If the error is a validation error, extract and return the error messages
		let errorList = [];
		for (let e in error.errors) {
			errorList.push(error.errors[e].message);
		}
		console.error(errorList);
		return NextResponse.json({
			msg: "Validation Error",
			errors: errorList,
			success: false,
		});
	} else if (error.code === 11000) {
		// If it's a duplicate key error
		console.error("Duplicate key error:", error);
		return NextResponse.json({
			msg: "Room already existing",
			success: false,
		});
	} else {
		// For other errors
		console.error("Error:", error);
		return NextResponse.json({
			msg: "An unexpected error occurred.",
			success: false,
		});
	}
}

// Function to handle a request with an unsupported method
function handleMethodNotAllowed() {
	return NextResponse.json({
		msg: "Method is not allowed!",
		success: false,
	});
}
