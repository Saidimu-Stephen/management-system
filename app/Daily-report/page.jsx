"use client";
import React, { useEffect, useState } from "react";
// import axios from "axios";

const DailyReport = () => {
	const [bookings, setBookings] = useState([]);
	const [apartmentName, setApartmentName] = useState("")
	const [apartments, setApartments] = useState([]);
	const [guestName, setGuetsName] = useState()
	const [bookingStatus, setBookingStatus] = useState()
	const [checkInDate, setCheckInDate] = useState()
	const [checkOutDate, setCheckOutDate] = useState()
	const [selectedRoom, setSelectedRoom] = useState("")
	const [apartmentNames, setApartmentNames] = useState([]); // New state for apartment names
	const [report, setReport] = useState([])
	const [roomNames, setRoomNames] = useState([]); // Store room names
	const [rooms, setRooms] = useState([]);
	const [error, setError] = useState("");  // Error state
	const [submitMessage, setSubmitMessage] = useState(""); // Define submitMessage state
	const [isSubmitting, setIsSubmitting] = useState(false); // Manage submission state

	useEffect(() => {
		console.log(report)
	}, [report])

	// Extract room names whenever `rooms` state updates
	useEffect(() => {
		const names = rooms.map((room) => room.roomName);
		setRoomNames(names);
		console.log("Room Names:", names); // Optional: Log for debugging
	}, [rooms]);


	// function to fetch rooms details 
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
	}, [apartmentName]);






	// function to load reports when the page loads
	useEffect(() => {
		// Fetch daily reports
		fetch("/api/getReport", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to load daily reports!"); // Proper error
				}
				return response.json(); // Fixed typo
			})
			.then((data) => setReport(data))
			.catch((error) => {
				console.error("Error fetching data:", error);
				setError("Failed to load daily reports"); // Improved error message
			});
	}, []); // Added dependency array to run only once

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
	// Extract apartment names when apartments state updates
	useEffect(() => {
		const names = apartments.map((apartment) => apartment.apartmentName);
		setApartmentNames(names);
	}, [apartments]);




	useEffect(() => {
		if (submitMessage) {
			const timer = setTimeout(() => setSubmitMessage(""), 5000); // Clears after 5s
			return () => clearTimeout(timer); // Cleanup on unmount or message change
		}
	}, [submitMessage]);



	// Function to add a new booking
	const handleSubmitBooking = async (e) => {
		e.preventDefault();
		if (isSubmitting) return; // Prevent multiple submissions
		console.log(apartmentName,
			guestName,
			bookingStatus,
			checkInDate,
			checkOutDate,
			selectedRoom)
		// Validate all fields
		if (
			!apartmentName ||
			!guestName ||
			!bookingStatus ||
			!checkInDate ||
			!checkOutDate ||
			!selectedRoom
		) {
			alert("Please fill in all fields before submitting.");
			setIsSubmitting(false);
			return;
		}

		setIsSubmitting(true);
		// Optionally open a popup if needed

		try {
			// Prepare data for submission
			const dailyReport = {
				apartmentName,
				guestName,
				bookingStatus,
				checkInDate,
				checkOutDate,
				selectedRoom,
			};

			// Send data to the backend
			const res = await fetch("/api/dailyReport", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(dailyReport),
			});

			// const responseData = await res.text();
			// Handle non-JSON responses
			const textResponse = await res.text(); // Parse response as text first
			let responseData;

			try {
				responseData = JSON.parse(textResponse); // Attempt to parse as JSON
			} catch (error) {
				console.error("Invalid JSON:", textResponse);
				throw new Error("Received invalid JSON from server.");
			}

			if (!res.ok) {
				throw new Error(responseData.msg || "Failed to submit data");
			}

			setSubmitMessage(responseData.msg || "Booking submitted successfully!");

			if (responseData.msg === "Booking created successfully") {
				resetForm();
				setError(""); // Clear errors
			}

		} catch (error) {
			console.error("Error:", error.message);
			setError(error.message);
			setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		setApartmentName("");
		setGuetsName("");
		setBookingStatus("");
		setCheckInDate("");
		setCheckOutDate("");
		setSelectedRoom("");
	};

	// Function to delete a booking


	return (
		<div className="container mx-auto p-4">
			<h1
				className="text-2xl  font-bold mb-4 text-black 
			text-center">
				Daily Report
			</h1>

			{/* Booking Table */}
			<div className="overflow-x-auto">
				{error && <p className="text-red-500">{error}</p>} {/* Display error if present */}
				<table className="min-w-full bg-white border border-gray-200 mb-4">
					<thead>
						<tr>
							<th className="py-2 px-4 text-black border-b text-left">
								Room Name
							</th>
							<th className="py-2 px-4 text-black border-b text-left">
								Guest Name
							</th>
							<th className="py-2 px-4 text-black border-b text-left">
								Status
							</th>
							<th className="py-2 px-4 text-black border-b text-left">
								Check-In Date
							</th>
							<th className="py-2 px-4 text-black border-b text-left">
								Check-Out Date
							</th>
							<th className="py-2 px-4 text-black border-b text-left">
								Apartment Name
							</th>
							<th className="py-2 px-4 text-black border-b text-left">
								Time Updated
							</th>

						</tr>
					</thead>
					<tbody>
						{report.map((booking) => (
							<tr key={booking._id}>
								<td className="py-2 px-4 border-b">{booking.selectedRoom}</td>
								<td className="py-2 px-4 border-b">{booking.guestName}</td>
								<td className="py-2 px-4 border-b">{booking.bookingStatus}</td>
								<td className="py-2 px-4 border-b">
									{new Date(booking.checkInDate).toLocaleDateString()}
								</td>
								<td className="py-2 px-4 border-b">
									{new Date(booking.checkOutDate).toLocaleDateString()}
								</td>
								<td className="py-2 px-4 border-b">{booking.apartmentName}</td>
								<td className="py-2 px-4 border-b">
									{new Date(booking.updatedAt).toLocaleString()}
								</td>

							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Add Booking Form */}
			<h2 className="text-xl text-gray-700 font-semibold mb-4">
				Add New Booking
			</h2>


			{submitMessage && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
					<div className="bg-white p-8 rounded-lg shadow-2xl border-2 border-green-500 animate-scale-in">
						<p className="text-green-600 font-bold text-2xl tracking-wider uppercase">
							{submitMessage}
						</p>
					</div>
				</div>
			)}




			<form
				onSubmit={handleSubmitBooking}
				className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
				<select
					value={apartmentName}  // The selected value is controlled by apartmentName state
					onChange={(e) => setApartmentName(e.target.value)}  // Updates apartmentName state on selection change
					className="border text-gray-400 rounded p-2"
					required
				>
					<option value="" disabled>
						Select Apartment Name
					</option>
					{apartmentNames.map((name, index) => (
						<option className="text-gray-600" key={index} value={name}>
							{name}
						</option>
					))}
				</select>
				<select
					value={selectedRoom}  // Controlled by the selectedRoom state
					onChange={(e) => setSelectedRoom(e.target.value)}  // Updates state on selection change
					className="border text-gray-400 rounded p-2"
					required
				>
					<option value="" disabled>
						Select Room Name
					</option>
					{roomNames.map((roomName, index) => (
						<option className="text-gray-600" key={index} value={roomName}>
							{roomName}
						</option>
					))}
				</select>


				<input
					type="text"
					placeholder="Guest Name"
					value={guestName} // Bind value to state
					onChange={(e) =>
						setGuetsName(e.target.value) // Update state on change
					}
					className="border text-gray-800 rounded p-2"
					required
				/>

				<select
					value={bookingStatus}
					onChange={(e) =>
						setBookingStatus(e.target.value)
					}
					className="border  text-gray-800 rounded p-2"
					required>
					<option value="Confirmed">Confirmed</option>
					<option value="Airbnb">Airbnb</option>
					<option value="Local"> Local</option>
					<option value="Booking.com"> Booking.com </option>
					<option value="Pending">Pending</option>
					<option value="Out">Out</option>
				</select>

				<input
					type="date"
					value={checkInDate}
					onChange={(e) =>
						setCheckInDate(e.target.value)
					}
					className="border text-gray-700 rounded p-2"
					required
				/>

				<input
					type="date"
					value={checkOutDate}
					onChange={(e) =>
						setCheckOutDate(e.target.value)
					}
					className="border text-gray-700  rounded p-2"
					required
				/>



				<button
					type="submit"
					className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 mt-4 col-span-1 md:col-span-2">
					Add Report
				</button>
			</form>

		</div>
	);
};

export default DailyReport;
