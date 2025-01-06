/** @format */

// Import necessary modules and models
import mongoose from "mongoose";
import connectDB from "@/app/lib/mongodb";
import Cleaners from "../../models/cleaners"; // Assuming you have a User model
import { NextResponse } from "next/server";

// Handle POST requests to create a new user
export async function POST(req) {
    if (req.method === "POST") {
        try {
            // Parse the JSON data from the request body
            const { firstName, secondName } = await req.json();


            // Validate input data
            if (!firstName || !secondName) {
                return handleErrorResponse({
                    msg: "Both first name and second name are required.",
                });
            }

            // Connect to the MongoDB database
            await connectDB();

            // Create a new user with the provided data
            const newCleaner = await Cleaners.create({
                firstName,
                secondName,
            });

            // Return a success response with the created user data
            return handleSuccessResponse(newCleaner);
        } catch (error) {
            // Handle errors, such as duplicate keys or validation errors
            return handleErrorResponse(error);
        }
    } else {
        // If the request method is not POST, return a method not allowed response
        return handleMethodNotAllowed();
    }
}

// Function to handle a successful user creation response
function handleSuccessResponse(newCleaner) {
    return NextResponse.json({
        msg: "Cleaner created successfully",
        data: newCleaner,
        success: true,
    });
}

// Function to handle errors that occur during user creation
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
            msg: "A cleaner with the same details already exists.",
            success: false,
        });
    } else {
        console.error("Error:", error);
        return NextResponse.json({
            msg: error.msg || "An unexpected error occurred.",
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
