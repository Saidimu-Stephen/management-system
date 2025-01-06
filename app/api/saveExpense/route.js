/** @format */

// Import necessary modules and models
import mongoose from "mongoose";
import connectDB from "@/app/lib/mongodb";
import Expenses from "../../models/expenses"; // Assuming you have an Expense model
import { NextResponse } from "next/server";

// Handle POST requests to create a new expense
export async function POST(req) {
    if (req.method === "POST") {
        try {
            // Parse the JSON data from the request body
            const {
                title,
                category,
                amount,
                date,
                paymentMethod,
                remarks,
                receipt,
            } = await req.json();

            console.log(title,
                category,
                amount,
                date,
                paymentMethod,
                remarks,
                receipt)

            // Validate input data
            if (!title || !category || !amount || !date || !paymentMethod || !remarks || !receipt) {
                return NextResponse.json({ msg: ["All required fields(title, category, amount, date, paymentMethod) must be provided."] });

            }

            // Connect to the MongoDB database
            await connectDB();

            // Create a new expense with the provided data
            const newExpense = await Expenses.create({
                title,
                category,
                amount,
                date,
                paymentMethod,
                remarks,
                receipt, // Ensure receipt is validated before saving
            });

            if (!newExpense.success) {
                return NextResponse.jason({
                    message: ["Failed to save expense"]
                })
            }


            return NextResponse.json({ message: ["Expense saved successfully."] });

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
    } else {
        // If the request method is not POST, return a method not allowed response
        return handleMethodNotAllowed();
    }
}

// Function to handle a successful expense creation response
function handleSuccessResponse(newExpense) {
    return NextResponse.json({
        msg: "Expense created successfully",
        data: newExpense,
        success: true,
    });
}

// Function to handle errors that occur during expense creation
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
            msg: "An expense with the same details already exists.",
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
