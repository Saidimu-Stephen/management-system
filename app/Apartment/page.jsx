/** @format */
"use client";
import React, { useState } from "react";
import Link from "next/link";

function Apartment() {
	const [apartmentName, setApartmentName] = useState("");
	const [location, setLocation] = useState("");
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!location || !apartmentName) {
			setError("Please fill in all the details");
			return;
		}

		if (location.length && apartmentName.length < 3) {
			setError("Invalid apartment name or location");
			return;
		}

		// Send post request to the database for saving the data
		try {
			const res = await fetch("/api/apartmentDetails", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					apartmentName,
					location,
				}),
			});
			const responseData = await res.json();

			if (!res.ok) {
				throw new Error(responseData.msg || "Failed to submit data");
			}
			setMessage(responseData.msg);
			setTimeout(() => setMessage(""), 5000);
		} catch (error) {
			console.error("Error:", error.message);
			setError("Failed to submit data");
			setTimeout(() => setError(""), 5000);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
			<div className="bg-white w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 rounded-lg shadow-md p-6">
				<div className="flex flex-col items-center">
					<h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
						Add New Apartment
					</h2>

					{error && (
						<div className="w-full bg-red-100 border border-red-400 text-red-700 p-3 rounded-md mb-4">
							<p className="text-center">{error}</p>
						</div>
					)}

					{message && (
						<div className="w-full bg-green-100 border border-green-400 text-green-700 p-3 rounded-md mb-4">
							<p className="text-center">{message}</p>
						</div>
					)}
				</div>

				<form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<label
							className="block text-sm font-medium text-gray-700 mb-1"
							htmlFor="apartmentName">
							Apartment Name:
						</label>
						<input
							className="w-full border-gray-300 rounded-md shadow-sm p-3 text-sm"
							type="text"
							id="apartmentName"
							placeholder="Apartment Name"
							value={apartmentName}
							onChange={(e) => setApartmentName(e.target.value)}
							required
						/>
					</div>

					<div>
						<label
							className="block text-sm font-medium text-gray-700 mb-1"
							htmlFor="location">
							Location:
						</label>
						<input
							className="w-full border-gray-300 rounded-md shadow-sm p-3 text-sm"
							type="text"
							id="location"
							placeholder="Location"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							required
						/>
					</div>

					<div className="flex flex-col items-center space-y-4">
						<button
							type="submit"
							className="w-full bg-blue-500 text-white font-bold py-2 rounded-md shadow hover:bg-blue-600 transition-colors duration-300">
							Save
						</button>

						<Link
							className="bg-red-500 text-white font-bold py-2 px-6 rounded-md hover:bg-red-600 transition-colors duration-300"
							href="/manage-apartments">
							Close
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Apartment;
