// Main page (ExpensesPage.jsx)
import React from "react";
import ExpenseOverview from "@/app/Expenses-Components/ExpenseOverview";
import ExpenseForm from "@/app/Expenses-Components/ExpenseForm";
import ExpenseCategory from "@/app/Expenses-Components/ExpenseCategory";
import ExpenseFilters from "@/app/Expenses-Components/ExpenseFilters";
import ExpenseList from "@/app/Expenses-Components/ExpenseList";
import ExpenseSummary from "@/app/Expenses-Components/ExpenseSummary";

const ExpensesPage = () => {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold text-center mb-6">Expenses Management</h1>

			{/* Overview Component */}
			<div className="mb-6">
				<ExpenseOverview />
			</div>

			{/* Form Component */}
			<div className="mb-6">
				<ExpenseForm />
			</div>

			{/* Categories Component */}
			<div className="mb-6">
				<ExpenseCategory />
			</div>

			{/* Filters Component */}
			<div className="mb-6">
				<ExpenseFilters />
			</div>

			{/* Expense List Component */}
			<div className="mb-6">
				<ExpenseList />
			</div>

			{/* Summary Component */}
			<div className="mb-6">
				<ExpenseSummary />
			</div>
		</div>
	);
};

export default ExpensesPage;
