import mongoose from "mongoose";

// Define the room assignment schema
const roomAssignmentSchema = new mongoose.Schema(
    {
        cleanerName: {
            type: String, // Store the cleaner's name directly
            required: true,
        },
        roomsAssigned: {
            type: [String], // Array of room names
            required: true,
        },
    },
    { timestamps: true }
);

// Pre-save hook to validate that a cleaner has not been assigned the same rooms on the same day
roomAssignmentSchema.pre("save", async function (next) {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); // Start of today (00:00:00)

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999); // End of today (23:59:59)

        // Check if an assignment exists for the same cleaner and rooms on the same day
        const existingAssignment = await RoomAssignments.findOne({
            cleanerName: this.cleanerName, // Match by cleaner's name
            roomsAssigned: { $all: this.roomsAssigned }, // Ensure all rooms are matched
            createdAt: { $gte: todayStart, $lte: todayEnd }, // Ensure it's within today's date range
        });

        if (existingAssignment) {
            throw new Error("This cleaner has already been assigned the same rooms today.");
        }

        next();
    } catch (error) {
        next(error); // Pass error to the next middleware (error handling)
    }
});

// Create the RoomAssignments model
const RoomAssignments =
    mongoose.models.RoomAssignments ||
    mongoose.model("RoomAssignments", roomAssignmentSchema);

export default RoomAssignments;
