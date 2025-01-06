/** @format */
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Page() {
	const [error, setError] = useState(""); // State variable for error message
	const [apartments, setApartments] = useState([]);
	const router = useRouter();

	// Search
	const [searchText, setSearchText] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [searchSuccessMessage, setSearchSuccessMessage] = useState(""); // State variable for success message
	const [searchUnsuccessMessage, setSearchUnsuccessMessage] = useState(""); // State variable for error message

	const [nameOfApartment, setNameOfApartmet] = useState("");
	const [apartmentsLocation, setApartmentsLocation] = useState("");

	// Open and close modal
	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	// Handle search input change
	const handleSearchInputChange = (event) => setSearchText(event.target.value);

	// Handle search functionality
	const handleSearch = async () => {
		try {
			const response = await fetch("/api/searchApartment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ searchText }),
			});

			if (!response.ok)
				throw new Error(`HTTP error! Status: ${response.status}`);

			const data = await response.json();
			const apartmentName = data.data.apartmentName;
			const apartmentLocation = data.data.location;

			if (apartmentName) {
				setSearchSuccessMessage(data.message[0]);
				setNameOfApartmet(apartmentName);
				setApartmentsLocation(apartmentLocation);

				setTimeout(() => setSearchSuccessMessage(""), 5000);
			} else {
				setSearchSuccessMessage("Searching error!!");
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			setSearchUnsuccessMessage(`HTTP error! Status: ${error.message}`);
			setTimeout(() => setSearchUnsuccessMessage(""), 3000);
		}
	};

	// Fetch apartments on load
	useEffect(() => {
		fetch("/api/getApartments", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				if (!response.ok) throw new Error("Failed to fetch apartments");
				return response.json();
			})
			.then((data) => setApartments(data))
			.catch((error) => {
				console.error("Error fetching data:", error);
				setError("Failed to fetch apartments");
			});
	}, []);


	
	// Handle apartment navigation
	const handleApartmentRooms = (id) => router.push(`/apartmentRooms?id=${id}`);
	const handleUpdate = (id) => console.log("Update apartment with ID:", id);
	const handleDelete = (id) => console.log("Delete apartment with ID:", id);

	return (
		<div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
			<h1 className="font-bold text-4xl py-4 text-center text-blue-800">
				Available Apartments
			</h1>

			{/* Display Success Message */}
			{searchSuccessMessage && (
				<div className="bg-green-200 text-gray-800 rounded-lg fixed text-lg p-4 mt-4">
					{searchSuccessMessage}
				</div>
			)}

			{/* Display Error Message */}
			{searchUnsuccessMessage && (
				<div className="bg-red-200 text-red-800 rounded-lg fixed text-lg p-4 mt-4">
					{searchUnsuccessMessage}
				</div>
			)}
			{error && <p className="text-red-500 text-lg">{error}</p>}

			{/* Apartments Table */}
			<div className="w-full overflow-x-auto">
				<table className="w-11/12 mx-auto border-collapse border border-gray-300 text-left bg-white shadow-md rounded-lg">
					<thead>
						<tr className="bg-blue-500 text-white">
							<th className="border border-gray-300 px-4 py-2">ID</th>
							<th className="border border-gray-300 px-4 py-2">
								Apartment Name
							</th>
							<th className="border border-gray-300 px-4 py-2">Location</th>
						</tr>
					</thead>
					<tbody>
						{apartments.map((apartment, index) => (
							<tr key={apartment._id} className="hover:bg-blue-100">
								<td className="border border-gray-300 text-black  px-4 py-2 text-center">
									{index + 1}
								</td>
								<td className="border text-black  border-gray-300 px-4 py-2">
									{apartment.apartmentName}
								</td>
								<td className="border border-gray-300 text-black px-4 py-2">
									{apartment.location}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Add Apartment Button */}
			<div className="pt-4">
				<Link
					className="bg-blue-600 hover:bg-blue-700 p-3 rounded text-white font-bold text-lg"
					href="/Apartment">
					Add Apartment
				</Link>
			</div>

			{/* View/Search Apartment Section */}
			<div className="flex flex-col items-center p-4 w-full space-y-4">
				<button
					className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded"
					onClick={openModal}>
					View Apartment
				</button>

				{/* Modal */}
				{isModalOpen && (
					<div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
						<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
							<h1 className="text-2xl text-black font-semibold text-center mb-4">
								Enter Apartment Name
							</h1>

							{nameOfApartment && (
								<div className="bg-white rounded-lg shadow-lg p-6">
									<h2 className="text-xl text-black font-bold mb-4 text-center">
										{nameOfApartment}
									</h2>
									<div className="mb-4">
										<p className="text-lg text-black font-semibold">
											Location:
										</p>
										<p className="text-gray-700">{apartmentsLocation}</p>
									</div>
									<div className="flex justify-center space-x-4">
										<Link
											className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
											href={{
												pathname: "/apartmentRooms",
												query: {
													apartmentName: nameOfApartment,
													location: apartmentsLocation,
												},
											}}>
											View Apartment Details
										</Link>
										<button
											className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
											onClick={closeModal}>
											Close Window
										</button>
									</div>
								</div>
							)}

							{/* Search Input */}
							<input
								type="text"
								value={searchText}
								onChange={handleSearchInputChange}
								className="border text-black border-gray-400 p-2 mb-4 w-full rounded"
								placeholder="Enter search text"
							/>
							<div className="flex justify-end space-x-2">
								<button
									className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded"
									onClick={handleSearch}>
									Search
								</button>
								<button
									className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded"
									onClick={closeModal}>
									Close
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Update and Delete Buttons */}
				<div className="flex space-x-4">
					<button
						className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-4 py-2 rounded"
						onClick={() => handleUpdate(apartment._id)}>
						Update Apartment
					</button>
					<button
						className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded"
						onClick={() => handleDelete(apartment._id)}>
						Delete Apartment
					</button>
				</div>
			</div>
		</div>
	);
}

export default Page;
