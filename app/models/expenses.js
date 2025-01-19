/** @format */

import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0, "Amount must be a positive number"],
        },
        date: {
            type: Date,
            required: [true, "Date is required"],
        },
        paymentMethod: {
            type: String,
            required: [true, "Payment method is required"],
            enum: ["Cash", "Credit Card", "Bank Transfer", "Other"], // Adjust based on your needs
        },
        remarks: {
            type: String,
            trim: true,
            maxlength: [500, "Remarks cannot exceed 500 characters"],
        },
        receipt: {
            type: String, // Assuming base64 or URL string for the receipt image
            trim: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Unique index to prevent redundancy based on title, amount, and date
ExpenseSchema.index({ title: 1, amount: 1, date: 1 }, { unique: true });

// Pre-save hook to prevent redundancy based on the combination of title, category, and date
ExpenseSchema.pre("save", async function (next) {
    const existingExpense = await mongoose.models.Expenses.findOne({
        title: this.title,
        amount: this.amount,
        date: this.date,
    });

    if (existingExpense) {
        const error = new Error("An expense with the same title, amount, and date already exists.");
        next(error); // If redundancy is detected, an error is thrown
    } else {
        next(); // No redundancy, proceed to save
    }
});

// Export the model or compile it if not already compiled
const Expenses = mongoose.models.Expenses || mongoose.model("Expenses", ExpenseSchema);
export default Expenses;
