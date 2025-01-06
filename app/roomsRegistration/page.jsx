/** @format */

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function RoomsRegistration(props) {
	const router = useRouter();
	const { searchParams } = props;
	const { nameOfApartment } = searchParams;
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitMessage, setSubmitMessage] = useState("");
	const [formData, setFormData] = useState({
		roomName: "",
		roomType: "",
		numberOfGuests: "",
		numberOfBeds: "",
		roomDescription: "",
		price: "",
	});

	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [roomData, setRoomData] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;
		for (const field in formData) {
			if (formData[field] === "") {
				alert("Please fill in all fields before submitting.");
				setIsSubmitting(false);
				return;
			}
		}
		setIsSubmitting(true);
		setIsPopupOpen(true);

		try {


			const updatedFormData = {
				...formData,
				nameOfApartment: nameOfApartment,
			};

			const res = await fetch("api/roomDescriptions", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({ updatedFormData }),
			});
			const responseData = await res.json();
			if (!res.ok) {
				throw new Error(responseData.msg || "Failed to submit data");
			}

			setSubmitMessage(responseData.msg || "Form submitted successfully!");
			setRoomData(responseData.data);

			if (responseData.msg === "Room created successfully") {
				setFormData({
					roomName: "",
					roomType: "",
					numberOfGuests: "",
					numberOfBeds: "",
					roomDescription: "",
					price: "",
				});
				setError("");
			}
		} catch (error) {
			console.error("Error:", error.message);
			setError(error.message);
			setTimeout(() => setError(""), 5000);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClosePopup = () => {
		setIsPopupOpen(false);
	};

	const handleGoBack = () => {
		router.back();
	};

	return (
		<div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
			<div className="bg-white shadow-lg rounded-lg max-w-lg w-full p-8">
				<h1 className="text-4xl font-bold text-gray-900 text-center mb-6">
					{nameOfApartment} Apartment
				</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<h2 className="text-2xl font-semibold text-gray-800">
						Room Description
					</h2>

					{isPopupOpen && (
						<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
							<div className="bg-white rounded-lg border-4 border-green-600 p-6 shadow-lg">
								<h1 className="text-green-600 font-bold text-4xl">
									{submitMessage}
								</h1>
								{submitMessage && (
									<div className="text-lg mt-4 text-black">
										<p className="font-semibold">Room Details:</p>
										<div className="mt-2 space-y-2">
											<p>
												<strong>Room Name:</strong> {roomData?.roomName}
											</p>
											<p>
												<strong>Room Type:</strong> {roomData?.roomType}
											</p>
											<p>
												<strong>Number of Guests:</strong>{" "}
												{roomData?.numberOfGuests}
											</p>
											<p>
												<strong>Room Description:</strong>{" "}
												{roomData?.roomDescription}
											</p>
											<p>
												<strong>Room Price:</strong> {roomData?.price}
											</p>
										</div>
										<button
											onClick={handleClosePopup}
											className="mt-4 bg-red-400 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors duration-200">
											Close
										</button>
									</div>
								)}
							</div>
						</div>
					)}

					{error && <p className="text-red-600">{error}</p>}

					<div>
						<label className="block text-gray-700 mb-2">Apartment Name</label>
						<div className="border-2 border-gray-300 p-2 rounded">
							<span className="text-gray-400">{nameOfApartment}</span>
						</div>
					</div>

					<div>
						<label htmlFor="roomName" className="block text-gray-700 mb-2">
							Room Title
						</label>
						<input
							type="text"
							id="roomName"
							name="roomName"
							value={formData.roomName}
							onChange={handleChange}
							className="w-full border-2 text-black border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
							placeholder="Enter room name or number"
						/>
					</div>

					<div>
						<label htmlFor="roomType" className="block text-gray-700 mb-2">
							Type
						</label>
						<select
							id="roomType"
							name="roomType"
							value={formData.roomType}
							onChange={handleChange}
							className="w-full border-2 border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 text-gray-400">
							<option value="" className="text-gray-400">
								Select room type
							</option>
							<option value="single" className="text-gray-400">
								Single
							</option>
							<option value="double" className="text-gray-400">
								Double
							</option>
							<option value="suite" className="text-gray-400">
								Suite
							</option>
							<option value="deluxe" className="text-gray-400">
								Deluxe
							</option>
							<option value="apartment" className="text-gray-400">
								Apartment
							</option>
							<option value="penthouse" className="text-gray-400">
								Penthouse
							</option>
						</select>
					</div>

					<div>
						<label
							htmlFor="numberOfGuests"
							className="block text-gray-700 mb-2">
							Number of Guests
						</label>
						<input
							type="number"
							id="numberOfGuests"
							name="numberOfGuests"
							value={formData.numberOfGuests}
							onChange={handleChange}
							className="w-full border-2 text-black border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
							placeholder="Enter number of guests"
						/>
					</div>

					<div>
						<label htmlFor="numberOfBeds" className="block text-gray-700 mb-2">
							Number of Beds
						</label>
						<input
							type="number"
							id="numberOfBeds"
							name="numberOfBeds"
							value={formData.numberOfBeds}
							onChange={handleChange}
							className="w-full border-2 text-black border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
							placeholder="Enter number of beds"
						/>
					</div>

					<div>
						<label
							htmlFor="roomDescription"
							className="block text-gray-700 mb-2">
							Room Description
						</label>
						<textarea
							id="roomDescription"
							name="roomDescription"
							value={formData.roomDescription}
							onChange={handleChange}
							className="w-full border-2 text-black border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
							placeholder="Enter room description"></textarea>
					</div>

					<div>
						<label htmlFor="price" className="block text-gray-700 mb-2">
							Price
						</label>
						<input
							type="number"
							id="price"
							name="price"
							value={formData.price}
							onChange={handleChange}
							className="w-full border-2 text-black border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
							placeholder="Enter price"
						/>
					</div>

					<div className="flex justify-between">
						<button
							type="submit"
							className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex-1 mr-2">
							Create Room
						</button>
						<button
							type="button"
							onClick={handleGoBack}
							className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md flex-1 ml-2">
							Back
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default RoomsRegistration;
