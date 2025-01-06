
/** @format */

// Import necessary modules and models
import mongoose from "mongoose";
import connectDB from "@/app/lib/mongodb";
import Cleaner from "../../models/cleaners"; // Assuming Cleaners model exists
import RoomAssignments from "../../models/roomAssignments"; // Assuming RoomAssignments model exists
import { NextResponse } from "next/server";

export async function POST(req) {
    if (req.method === "POST") {
        try {
            // Parse the JSON data from the request body
            const { cleaner, rooms } = await req.json();



            // Validate input data
            if (!cleaner || !rooms || rooms.length === 0) {
                return handleErrorResponse({
                    msg: "Both a cleaner and at least one room must be selected.",
                });
            }

            // Connect to the MongoDB database
            await connectDB();

            // Create a new room assignment entry in the database
            const roomAssignment = new RoomAssignments({
                cleanerName: cleaner, // Store the cleaner's name directly
                roomsAssigned: rooms, // rooms is an array of room names
            });

            // Save the room assignment to the database
            await roomAssignment.save();

            // Return a success response with the room assignment data
            return handleSuccessResponse(roomAssignment);
        } catch (error) {
            // Handle errors, such as validation errors or database issues
            return handleErrorResponse(error);
        }
    } else {
        // If the request method is not POST, return a method not allowed response
        return handleMethodNotAllowed();
    }
}

// Function to handle a successful room assignment response
function handleSuccessResponse(roomAssignment) {
    return NextResponse.json({
        msg: "Rooms successfully assigned to the cleaner!",
        data: roomAssignment,
        success: true,
    });
}

function handleErrorResponse(error) {
    let msg = "An unexpected error occurred.";

    if (error instanceof mongoose.Error.ValidationError) {
        const errorList = Object.values(error.errors).map(e => e.message);
        msg = errorList.join(", ");
    } else if (error.code === 11000) {
        msg = "Duplicate room assignment error.";
    } else if (error.message) {
        msg = error.message; // Use the error message if it's provided
    }

    console.error("Error Response:", msg); // Log the exact error for debugging
    return NextResponse.json({
        msg,
        success: false,
    });
}


// Function to handle unsupported request methods
function handleMethodNotAllowed() {
    return NextResponse.json({
        msg: "Method not allowed!",
        success: false,
    });
}
