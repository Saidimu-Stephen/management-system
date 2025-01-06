import connectDB from "@/app/lib/mongodb";
import Cleaner from "@/app/models/cleaners"; // Adjust the path to your Cleaner model
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB(); // Ensure the database is connected
        const cleaners = await Cleaner.find({}); // Fetch all cleaners
        console.log("hello")
        return NextResponse.json({
            success: true,
            data: cleaners,
        });
    } catch (error) {
        console.error("Error fetching cleaners:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch cleaners.",
        });
    }
}
