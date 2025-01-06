/** @format */

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ImageUpload from "@/app/Components/imagesPicker";

function Page(props) {
	const { searchParams } = props;
	const { apartmentName } = searchParams;
	const { location } = searchParams;

	const [messages, setMessages] = useState([]);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const Apartment_Name = apartmentName;
	const [loading, setLoading] = useState(false);
	const [rooms, setRooms] = useState([]);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [apartments, setApartments] = useState([]);
	const [error, setError] = useState(null);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [selectedRoomId, setSelectedRoomId] = useState(null);
	const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);
	const [selectedRoomName, setSelectedRoomName] = useState(null);

	useEffect(() => {
		// Your fetch request
		const fetchRooms = async () => {
			try {
				const response = await fetch("/api/getRoomDetails", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ Apartment_Name: apartmentName }), // Sending apartmentName in the request body
				});
				if (!response.ok) {
					throw new Error("Failed to fetch rooms");
				}
				const data = await response.json();

				setRooms(data);
			} catch (error) {
				console.error("Error fetching data:", error);
				setError("Failed to fetch rooms");
			}
		};

		if (apartmentName) {
			// Only fetch when apartmentName is available
			fetchRooms();
		}
	}, [apartmentName]); // Depend on apartmentName to trigger the fetch

	const handleRoomClick = (roomId) => {
		setSelectedRoomId(roomId);

		const selectedRoom = rooms.find((room) => room._id === roomId);

		// Set the selected room details
		setSelectedRoomDetails(selectedRoom);

		setSelectedRoomName(selectedRoom.roomName);
	};

	// method to handle deletion of rooms
	// Delete Room Function
	const handleDeleteRoom = async () => {
		// Confirm with the user before proceeding with the deletion
		const isConfirmed = window.confirm(
			"Are you sure you want to delete this room? This action cannot be undone."
		);

		if (!isConfirmed) {
			return; // Exit if the user cancels the operation
		}
		try {
			setLoading(true); // Show loading animation if needed

			// Send POST request to the server with the selectedRoomName
			const res = await fetch("/api/deleteRoom", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					selectedRoomName, // Send the room name to be deleted
				}),
			});

			if (!res.ok) {
				setLoading(false);
				throw new Error("Failed to delete room");
			}

			const responseData = await res.json();

			// Handle the response, which includes room deletion and image deletion messages
			if (responseData.roomDeleted) {
				setMessages([
					responseData.message, // Main room deletion message
					responseData.details.mainImageMessage, // Message for main image deletion
					responseData.details.minorImageMessage, // Message for minor images deletion
				]);
			} else {
				// If the room was not found, show the corresponding message
				setMessages([responseData.message]);
			}

			// Optionally update the state to remove the deleted room from the list
			setRooms((prevRooms) =>
				prevRooms.filter((room) => room.roomName !== selectedRoomName)
			);

			// Clear selected room details after deletion
			setSelectedRoomDetails(null);
			setSelectedRoomName(null);
		} catch (error) {
			console.error("Error:", error.message);
			setMessages(["Failed to delete room"]);
		} finally {
			setLoading(false); // Stop loading animation
		}
	};

	// const handleDeleteRoom = async () => {
	// 	try {
	// 		setLoading(true); // Show loading animation if needed



	// 		// Send DELETE request to the server with the selectedRoomName
	// 		const res = await fetch("/api/deleteRoom", {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify({
	// 				selectedRoomName, // Send the room name to be deleted
	// 			}),
	// 		});

	// 		if (!res.ok) {
	// 			setLoading(false);
	// 			throw new Error("Failed to delete room");
	// 		}

	// 		const responseData = await res.json();
	// 		// Show success message
	// 		setMessages([responseData.message]);

	// 		// Optionally update the state to remove the deleted room from the list
	// 		setRooms(rooms.filter((room) => room.roomName !== selectedRoomName));

	// 		// Clear selected room details after deletion
	// 		setSelectedRoomDetails(null);
	// 		setSelectedRoomName(null);
	// 	} catch (error) {
	// 		console.error("Error:", error.message);
	// 		setMessages(["Failed to delete room"]);
	// 	} finally {
	// 		setLoading(false); // Stop loading animation
	// 	}
	// };

	// Function to close the message popup
	const handleClosePopup = () => {
		setMessages([]);
	};

	return (
		<div className="md:flex md:justify-center flex flex-col">
			{/* Loading animation */}
			{loading && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
					<div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
				</div>
			)}

			{messages.length > 0 && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white rounded-lg border-2 border-green-500 p-6 shadow-lg">
						<h1 className="text-2xl font-semibold text-green-700 mb-4">
							Message
						</h1>
						<div className="text-lg text-gray-800 mb-4">
							{messages.map((message, index) => (
								<p key={index}>{message}</p>
							))}
						</div>
						<button
							onClick={handleClosePopup}
							className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
							Close
						</button>
					</div>
				</div>
			)}
			{/* Header Section */}
			<div className="w-full flex flex-col items-center bg-blue-600 py-4">
				<h1 className="text-4xl md:text-6xl font-semibold text-center font-serif capitalize tracking-wider text-white shadow-xl">
					{apartmentName}
					<p className="text-base md:text-xl capitalize tracking-normal text-white mt-2">
						{location}
					</p>
				</h1>
			</div>

			{/* Main Section */}
			<div className="flex flex-col md:flex-row w-full h-auto md:h-screen px-4 mt-4 space-y-4 md:space-y-0 md:space-x-4">
				{/* Available Rooms Section */}
				<div className="bg-white border-2 border-gray-300 p-6 w-full md:w-1/4 flex flex-col items-center rounded-lg shadow-md h-auto md:h-screen">
					<h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-4">
						Available Rooms
					</h1>

					<div className="flex flex-col justify-center p-4 w-full border border-gray-300 rounded-lg shadow-md overflow-y-auto space-y-4">
						<div className="text-center text-gray-300">			<h1>click to view room details</h1></div>
						{rooms.map((room) => (
							<div
								key={room._id}
								className="p-4 border border-gray-200 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 flex items-center justify-between bg-gray-50"
								onClick={() => handleRoomClick(room._id)}>
								<div className="text-xl text-black font-semibold">
									{room.roomName}
								</div>
							</div>
						))}
						{error && <p className="text-red-500">{error}</p>}
					</div>

					{/* Add Rooms Button */}
					<div className="mt-4 flex gap-2">
						{/* Add Rooms Button */}
						<div>
							<Link
								href={{
									pathname: "/roomsRegistration",
									query: { nameOfApartment: apartmentName },
								}}
								className="bg-blue-500 hover:bg-blue-700 text-white text-xl py-2 px-4 rounded-md shadow-md transition-colors"
							>
								Add Rooms
							</Link>
						</div>

						{/* Back Button (Using Muted Red Color for Contrast) */}
						<div>
							<Link
								href={{
									pathname: "/manage-house"
								}}
								className="bg-gray-500 hover:bg-gray-700 text-white text-xl py-2 px-4 rounded-md shadow-md transition-colors"
							>
								Back
							</Link>
						</div>
					</div>

				</div>

				{/* Room Details & Image Upload Section */}
				<div className="bg-white border-2 border-gray-300 w-full md:w-3/4 p-6 rounded-md shadow-md flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
					{/* Selected Room Details */}
					<div className="w-full md:w-1/2">
						{selectedRoomDetails && (
							<div className="bg-gray-100 border border-gray-300 h-full rounded-md shadow-md overflow-y-auto p-4">
								<h1 className="text-xl md:text-3xl font-bold underline text-center text-gray-800 mb-4">
									{selectedRoomDetails.roomName}
								</h1>
								{/* Room Details */}
								{Object.entries(selectedRoomDetails)
									.filter(([key]) => key !== "_id" && key !== "__v")
									.map(([key, value]) => (
										<div key={key} className="mb-4">
											<div className="text-gray-700 font-semibold capitalize">
												{key}
											</div>
											<div className="text-gray-900 bg-gray-200 rounded-md px-3 py-1 border border-gray-400">
												{value}
											</div>
										</div>
									))}
								{/* Delete Button */}
								<div className="flex justify-center mt-4">
									<button
										onClick={handleDeleteRoom}
										className="bg-red-500 hover:bg-red-700 text-white text-xl px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
										Delete
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Image Upload Section */}
					<div className="bg-gray-100 border border-gray-300 h-full w-full md:w-1/2 p-6 rounded-md shadow-md flex flex-col items-center">
						<ImageUpload selectedRoomName={selectedRoomName} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Page;
