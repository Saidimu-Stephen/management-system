import mongoose from "mongoose";

const cleanersSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required."],
            trim: true,
        },
        secondName: {
            type: String,
            required: [true, "Second name is required."],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Add a composite index to ensure unique combinations of firstName and secondName
cleanersSchema.index({ firstName: 1, secondName: 1 }, { unique: true });

// Use existing model or create a new one
const Cleaner = mongoose.models.Cleaner || mongoose.model("Cleaner", cleanersSchema);

export default Cleaner;
