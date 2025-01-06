import mongoose from "mongoose";

const dailyReportSchema = new mongoose.Schema(
    {
        apartmentName: { type: String, required: true },
        guestName: { type: String, required: true },
        bookingStatus: { type: String, required: true },
        checkInDate: { type: Date, required: true },
        checkOutDate: { type: Date, required: true },
        selectedRoom: { type: String, required: true },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Create a compound index to enforce uniqueness across multiple fields
dailyReportSchema.index(
    {
        apartmentName: 1,
        guestName: 1,
        bookingStatus: 1,
        checkInDate: 1,
        checkOutDate: 1,
        selectedRoom: 1,
    },
    { unique: true }
);

const DailyReport =
    mongoose.models.DailyReport || mongoose.model("DailyReport", dailyReportSchema);

export default DailyReport;
