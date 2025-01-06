'use client'
import React from "react";

const ExpenseSummary = () => {
    return (
        <div className="p-4 bg-red-100 rounded shadow">
            <h2 className="text-xl font-semibold">Expense Summary</h2>
            <p>Total Amount: $25.00</p>
            <p>Most Spent On: Food</p>
        </div>
    );
};

export default ExpenseSummary;
