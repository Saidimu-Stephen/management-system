/** @format */

// Import necessary modules and models
import mongoose from "mongoose";
import connectDB from "@/app/lib/mongodb";
import DailyReport from "../../models/dailyReport"; // Assuming you have this model
import { NextResponse } from "next/server";

// Handle POST requests to create a new booking
export async function POST(req) {
    if (req.method === "POST") {
        try {
            // Parse the JSON data from the request body
            const { apartmentName, guestName, bookingStatus, checkInDate, checkOutDate, selectedRoom } = await req.json();

            // Connect to the MongoDB database
            await connectDB();
            console.log(apartmentName,
                guestName,
                bookingStatus,
                checkInDate,
                checkOutDate,
                selectedRoom)


            // Create a new booking with the provided data
            const newDailyReport = await DailyReport.create({
                apartmentName,
                guestName,
                bookingStatus,
                checkInDate,
                checkOutDate,
                selectedRoom,
            });

            // Return a success response with the created booking data
            return handleSuccessResponse(newDailyReport);
        } catch (error) {
            if (error.code === 11000) {
                // Handle duplicate key error
                return NextResponse.json({
                    msg: "A booking with the same details already exists.",
                    success: false,
                });
            }
            console.error("Error creating booking:", error);
            return NextResponse.json({
                msg: "An unexpected error occurred.",
                success: false,
            });
        }
    } else {
        // If the request method is not POST, return a method not allowed response
        return handleMethodNotAllowed();
        // } { submitMessage && <p className="text-green-500 mt-4">{submitMessage}</p> }

    }
}

// Function to handle a successful booking creation response
function handleSuccessResponse(newDailyReport) {
    return NextResponse.json({
        msg: "Booking created successfully",
        data: newDailyReport,
        success: true,
    });
}

// Function to handle errors that occur during booking creation
function handleErrorResponse(error) {
    if (error instanceof mongoose.Error.ValidationError) {
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
        console.error("Duplicate key error:", error);
        return NextResponse.json({
            msg: "DailyReport already exists",
            success: false,
        });
    } else {
        console.error("Error:", error);
        return NextResponse.json({
            msg: "An unexpected error occurred.",
            success: false,
        });
    }
}

// Function to handle unsupported request methods
function handleMethodNotAllowed() {
    return NextResponse.json({
        msg: "Method not allowed!",
        success: false,
    });
}
