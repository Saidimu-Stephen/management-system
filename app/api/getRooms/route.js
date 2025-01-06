import connectDB from "@/app/lib/mongodb";
import Room from "app/models/roomDetails"; // Adjust the import path to match your project structure
import { NextResponse } from "next/server";

export async function GET() {


    try {
        await connectDB();
        // Fetch only the `roomName` field
        const rooms = await Room.find({}, "roomName").lean();



        return NextResponse.json({
            success: true,
            data: rooms,
        });

    } catch (error) {
        console.error("Error fetching room names:", error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
}
