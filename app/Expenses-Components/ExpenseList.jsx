'use client'
import React from "react";

const ExpenseList = () => {
    const expenses = [
        { id: 1, description: "Grocery", amount: "$20", category: "Food" },
        { id: 2, description: "Bus ticket", amount: "$5", category: "Transport" },
    ];

    return (
        <div className="p-4 bg-purple-100 rounded shadow">
            <h2 className="text-xl font-semibold">Expense List</h2>
            <ul>
                {expenses.map((expense) => (
                    <li key={expense.id}>
                        {expense.description} - {expense.amount} ({expense.category})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExpenseList;
