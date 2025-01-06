'use client'
import React, { useState } from "react";

const ExpenseCategory = () => {
    const [categories, setCategories] = useState(["Food", "Transport", "Utilities"]);

    const addCategory = () => {
        const newCategory = prompt("Enter new category:");
        if (newCategory) setCategories([...categories, newCategory]);
    };

    return (
        <div className="p-4 bg-yellow-100 rounded shadow">
            <h2 className="text-xl font-semibold">Expense Categories</h2>
            <ul>
                {categories.map((cat, index) => (
                    <li key={index}>{cat}</li>
                ))}
            </ul>
            <button onClick={addCategory} className="bg-blue-500 text-white py-1 px-2 rounded mt-2">
                Add Category
            </button>
        </div>
    );
};

export default ExpenseCategory;
