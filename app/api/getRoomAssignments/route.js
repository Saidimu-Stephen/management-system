import connectDB from "@/app/lib/mongodb";
import RoomAssignments from "@/app/models/roomAssignments";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectDB(); // Ensure the database is connected

        // Fetch room assignments directly (cleanerName is already stored)
        const roomAssignments = await RoomAssignments.find({});

        console.log(roomAssignments);
        return NextResponse.json({
            success: true,
            data: roomAssignments,
        });
    } catch (error) {
        console.error("Error fetching room assignments:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch room assignments.",
        });
    }
}
