// Main page (ExpensesPage.jsx)
import React from "react";
import ExpenseOverview from "@/app/Expenses-Components/ExpenseOverview";
import ExpenseForm from "@/app/Expenses-Components/ExpenseForm";
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







			{/* Summary Component */}
			<div className="mb-6">
				<ExpenseSummary />
			</div>
		</div>
	);
};

export default ExpensesPage;
