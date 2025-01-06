/* eslint-disable @next/next/no-img-element */
/** @format */

import React, { useEffect, useState } from "react";

function ImageUpload({ selectedRoomName }) {
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [mainImage, setMainImage] = useState();
	const [minorImages, setMinorImages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [mainImageDatabase, setMainImageDatabase] = useState();
	const [minorImagesDatabase, setMinorImagesDatabase] = useState([]);



	const [refreshKey, setRefreshKey] = useState(0); // State to trigger re-render

	const reloadComponent = () => {
		setRefreshKey((prevKey) => prevKey + 1); // Update the state to force re-render
		console.log("refreshed!")
	};
	// Function to fetch images
	const fetchImages = async () => {
		setIsLoading(true); // Show loading spinner
		try {

			// Ensure the room name is valid before making the request
			if (!selectedRoomName) {
				setMessage("Please select a valid room name.");
				return;
			}

			const response = await fetch("/api/getImages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ selectedRoomName }),
			});

			// Check if the response is not OK
			if (!response.ok) {
				const errorResponse = await response.json(); // Extract potential error message
				setError(errorResponse.message || "Failed to fetch images");
				setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
				return;
			}

			const data = await response.json();

			// Handle case where no images are found
			if (!data.mainImage || !data.minorImages) {
				setMainImageDatabase(null);
				setMinorImagesDatabase([]);
				reloadComponent()
				setMessage(data.message || "No images found for the selected room.");
			} else {
				// Process and set images to state
				const mainImageData = data.mainImage.map((image) => image.mainImage);
				const minorImagesData = data.minorImages.flatMap((image) => image.minorImages);

				setMainImageDatabase(mainImageData);
				setMinorImagesDatabase(minorImagesData);
			}

			// Display messages if provided
			if (data.messages) {
				setMessage(data.messages);
				setTimeout(() => setMessage(""), 5000);
			}
		} catch (error) {
			console.error("Error fetching images:", error.message);
			setError("An unexpected error occurred while fetching images.");
			setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
		}
		finally {
			setIsLoading(false); // Hide loading spinner
		}
	};

	// function to fetch images on loading
	useEffect(() => {


		if (selectedRoomName) {
			fetchImages();
		}
	}, [selectedRoomName]);

	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 200 * 1024) {
				try {
					const compressedImage = await compressImage(file);
					const compressedImageData = await readFileAsDataURL(compressedImage);

					console.log("Compressed Image Data:", compressedImageData);

					setMainImage(compressedImageData); // Ensure this is set after compression
					setError("");
				} catch (error) {
					console.error("Error compressing image:", error);
					setError("Error compressing main image");
				}
			} else {
				console.log("Original Image Data:", file);
				setMainImage(file); // Directly set the image if it's small enough
				setError("");
			}
		}
	};

	// function to compress images
	const compressImage = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (event) => {
				const img = new Image();
				img.src = event.target.result;
				img.onload = () => {
					const canvas = document.createElement("canvas");
					const ctx = canvas.getContext("2d");
					const maxWidth = 800;
					const maxHeight = 800;
					let width = img.width;
					let height = img.height;
					if (width > height) {
						if (width > maxWidth) {
							height *= maxWidth / width;
							width = maxWidth;
						}
					} else {
						if (height > maxHeight) {
							width *= maxHeight / height;
							height = maxHeight;
						}
					}
					canvas.width = width;
					canvas.height = height;
					ctx.drawImage(img, 0, 0, width, height);
					canvas.toBlob(
						(blob) => {
							const compressedFile = new File([blob], file.name, {
								type: "image/jpeg",
								lastModified: Date.now(),
							});
							resolve(compressedFile);
						},
						"image/jpeg",
						0.5
					);
				};
				img.onerror = (error) => {
					reject(error);
				};
			};
			reader.onerror = (error) => {
				reject(error);
			};
		});
	};

	// function to pick multiple images from computer
	const readFileAsDataURL = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				resolve(reader.result);
			};
			reader.onerror = (error) => {
				reject(error);
			};
			reader.readAsDataURL(file);
		});
	};

	// function to handle selecte multipl images
	const handleMultipleImageChange = async (event) => {
		const files = Array.from(event.target.files);
		const compressedImages = await Promise.all(files.map(compressImage));
		const base64Images = await Promise.all(
			compressedImages.map(readFileAsDataURL)
		);
		setMinorImages(base64Images);
	};

	// function to delete multiple selected image
	const handleDeleteImage = (index) => {
		const filteredImages = [...minorImages];
		filteredImages.splice(index, 1);
		setMinorImages(filteredImages);
	};

	const handleSaveToDatabase = async () => {
		try {
			setLoading(true);

			const mainImageBase64 =
				typeof mainImage === "string" && mainImage.startsWith("data:")
					? mainImage
					: await readFileAsDataURL(mainImage); // Ensure mainImage is base64

			const res = await fetch("/api/saveImages", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					selectedRoomName,
					mainImage: mainImageBase64, // Send base64 string
					minorImages, // Assuming minorImages are already base64 strings
				}),
			});

			if (!res.ok) {
				throw new Error("Failed to save images");
			}

			const responseData = await res.json();
			setMessages(responseData.messages);

			console.log(responseData.messages)

			setTimeout(() => setMessages([]), 5000);
		} catch (error) {
			console.error("Error:", error.message);
			setMessages(["Failed to save images"]);
			setTimeout(() => setMessages([]), 5000);
		} finally {
			setLoading(false);
		}
	};

	// Function to handle delete images from the database
	const handleDeleteImageDatabase = async () => {
		const isConfirmed = window.confirm("Are you sure you want to delete images from the database? This action cannot be undone.");
		if (!isConfirmed) {
			return;
		}

		try {
			setLoading(true);

			const res = await fetch("/api/deleteRoomImages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ selectedRoomName }),
			});

			if (!res.ok) {
				throw new Error("Failed to delete images");
			}

			const responseData = await res.json();
			const messages = [];

			if (responseData.details.mainImageMessage) {
				messages.push(responseData.details.mainImageMessage);
			}

			if (responseData.details.minorImageMessage) {
				messages.push(responseData.details.minorImageMessage);
			}
			// Show messages
			setMessages(messages.length > 0 ? messages : [responseData.message]);

			// Clear the states for the images
			setMainImage(null); // Clear the main image state
			setMinorImages([]); // Clear the minor images state (if it's an array, otherwise set to null)

			// Optionally, re-fetch images if you are managing images via a fetch operation
			await fetchImages(); // Uncomment if you have a function to fetch images again


		} catch (error) {
			console.error("Error:", error.message);
			setMessages(["Failed to delete images"]);
		} finally {
			setLoading(false);
		}
	};

	// Effect to clear messages after 3 seconds
	useEffect(() => {
		if (messages.length > 0) {
			const timer = setTimeout(() => {
				setMessages([]); // Clear the messages
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [messages]);



	// funtion to clear the message after some seconds 
	useEffect(() => {
		if (message) {
			const timer = setTimeout(() => {
				setMessage(""); // Clear the messages
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [message]);





	return (
		<div key={refreshKey}

			className="container mx-auto px-4 flex flex-col items-center
			 justify-center py-4 md:flex-row md:flex-wrap">


			{/* Loading spinner */}
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center
				 bg-white  bg-opacity-70 z-50">


					<div>
						<div className="spinner"></div>
						<p className="mt-4 text-gray-700 text-center font-semibold">Loading images...
						</p>
					</div>
				</div>
			)}
			{!isLoading && (
				<>
					{/* CSS Spinner Styling */}

					{/* Display messages if they exist */}
					{messages.length > 0 && (
						<div className="mb-4 p-2 bg-green-300 text-black rounded-md">
							{messages.map((msg, index) => (
								<div key={index}>{msg}</div>
							))}
						</div>
					)}

					{message && (
						<div className="mb-4 p-2 bg-yellow-300 text-white rounded-md">
							{message}
						</div>
					)}
					{mainImageDatabase &&
						minorImagesDatabase &&
						mainImageDatabase.length > 0 &&
						minorImagesDatabase.length > 0 ? (
						<div className="w-full md:w-3/4 mx-auto flex flex-col items-center">
							{/* Display Main Image */}
							<div className="mb-8 w-full text-center">
								<h1 className="text-3xl font-semibold mb-4 text-gray-800">
									Main Image
								</h1>
								<img
									src={mainImageDatabase[0]}
									alt="Main Image"
									className="w-full h-auto max-h-72 object-cover rounded-lg shadow-lg 
							transition-transform duration-300 hover:scale-105"
								/>
							</div>

							{/* Display Minor Images */}
							<div className="w-full">
								<h1 className="text-2xl font-semibold mb-4 text-gray-800">
									Minor Images
								</h1>
								<div className="flex overflow-x-auto space-x-4 py-2 scrollbar-hide">
									{minorImagesDatabase.map((image, index) => (
										<div key={index} className="flex-none w-40 md:w-48">
											<img
												src={image}
												alt={`Minor Image ${index + 1}`}
												className="w-full h-32 object-cover rounded-lg shadow-lg
										 transition-transform duration-300 hover:scale-105"
											/>
										</div>
									))}
								</div>
							</div>

							<div className=" flex justify-center w-full py-4">
								<button className="bg-red-400 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md transition-all 
						duration-300"

									onClick={handleDeleteImageDatabase}>
									Delete images
								</button>
							</div>
						</div>
					) : (
						<div className="w-full md:w-3/4 flex flex-col items-center">
							<h1 className="underline text-3xl font-bold text-center mb-6 text-gray-700">
								Upload Images
							</h1>

							{/* Main image picker */}
							<div className="flex flex-col items-center w-full mb-6">
								<h1 className="text-xl font-medium text-gray-500 mb-2">
									Main Image
								</h1>
								<label
									htmlFor="mainImagePicker"
									className="cursor-pointer w-full flex justify-center">
									<div className="w-72 h-40 bg-gray-200 border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors duration-300 flex items-center justify-center">
										{mainImage ? (
											<img
												src={
													typeof mainImage === "string" &&
														mainImage.startsWith("data:")
														? mainImage
														: URL.createObjectURL(mainImage)
												}
												alt="Selected"
												className="w-full h-full object-cover rounded-lg"
											/>
										) : (
											<>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-16 w-16 text-blue-500"
													viewBox="0 0 20 20"
													fill="currentColor">
													<path
														fillRule="evenodd"
														d="M16 7V5a5 5 0 00-5-5H9a5 5 0 00-5 5v2a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3v-6a3 3 0 00-3-3zM7 5a3 3 0 016 0v2H7V5z"
														clipRule="evenodd"
													/>
												</svg>
												<span className="ml-2 text-gray-600">Choose Image</span>
											</>
										)}
									</div>
								</label>
								<input
									type="file"
									id="mainImagePicker"
									className="hidden"
									accept="image/*"
									onChange={handleImageChange}
								/>
							</div>

							{/* Multiple image picker */}
							<div className="w-full flex flex-col items-center mb-6">
								<h1 className="text-xl font-medium text-gray-500 mb-2">
									Supporting Images
								</h1>
								<div className="relative w-full flex justify-center">
									<button
										className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md
							 hover:bg-blue-600 transition-all duration-300">
										Choose Images
									</button>
									<input
										type="file"
										accept="image/*"
										multiple
										onChange={handleMultipleImageChange}
										className="absolute inset-0 opacity-0 cursor-pointer"
									/>
								</div>
								<div className="grid grid-cols-2 gap-4 mt-4 w-full max-h-48 overflow-y-auto">
									{minorImages.map((imageData, index) => (
										<div key={index} className="relative">
											<img
												src={imageData}
												alt={`Preview ${index}`}
												className="w-full h-32 object-cover rounded-lg"
											/>
											<button
												onClick={() => handleDeleteImage(index)}
												className="absolute top-0 right-0 bg-red-500 hover:bg-red-700
										 text-white px-2 py-1 rounded-full shadow-md">
												delete
											</button>
										</div>
									))}
								</div>
							</div>

							<div className="flex justify-center w-full py-4">
								<button
									onClick={handleSaveToDatabase}
									disabled={loading}
									className={`bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-all 
								duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""
										}`}>
									Save to Database
								</button>
								{loading && (
									<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl">
										Loading...
									</div>
								)}
							</div>



							{/* Pop-up for displaying messages */}
							{messages.length > 0 && (
								<div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
									<div className="bg-green-500 text-black px-4 py-2 rounded-lg shadow-lg max-w-md w-full">
										<h2 className="text-lg font-semibold mb-2">Messages:</h2>
										{messages.map((message, index) => (
											<div key={index} className="mb-2">
												{message}
											</div>
										))}
									</div>
								</div>
							)}

							{error && (
								<div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
									<div className="bg-red-500 text-white px-4 py-2 rounded">
										{error}
									</div>
								</div>
							)}
						</div>
					)}
				</>
			)}
			<style jsx>{`
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #4caf50;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin: 10px auto;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
		</div>
	);
}

export default ImageUpload;
