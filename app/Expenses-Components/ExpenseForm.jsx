"use client"
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ExpenseForm = () => {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState("");

    const [expense, setExpense] = useState({
        title: "",
        category: "",
        amount: "",
        date: null,
        paymentMethod: "",
        remarks: "",
        receipt: null,

    });

    const [newImage, setNewImage] = useState(null)



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExpense((prevExpense) => ({ ...prevExpense, [name]: value }));
    };

    const handleDateChange = (date) => {
        setExpense((prevExpense) => ({ ...prevExpense, date }));
    };

    const handleFileChange = (e) => {
        setExpense((prevExpense) => ({ ...prevExpense, receipt: e.target.files[0] }));
    };

    //  saving to data base 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Prepare the request body
            const requestBody = {
                // Include other fields as needed based on your API
                title: expense.title,
                category: expense.category,
                amount: expense.amount,
                date: expense.date,
                paymentMethod: expense.paymentMethod,
                remarks: expense.remarks,
                receipt: expense.receipt, // Ensure receipt is in the correct format (e.g., base64)
            };

            const res = await fetch("/api/saveExpense", { // Replace with your API endpoint
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),

            });

            if (!res.ok) {
                throw new Error("Failed to save expense");
            }

            const responseData = await res.json();
            setMessages(responseData.message);
            setTimeout(() => setMessages([]), 5000);
        } catch (error) {
            console.error("Error saving expense:", error);

            setMessages(["Failed to save expense"]);
            setTimeout(() => setMessages([]), 5000);
        } finally {
            setLoading(false);
        }
    };

    // function to convert the image to string base 64 for easier storage 
    const convertBlobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(blob);
        });
    };


    // handle image change in the receipt picker 
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            alert("No image selected. Please choose an image."); // Notify the user
            return; // Exit the function
        }
        if (file) {

            // Create a clean Blob (stripping metadata)
            const cleanBlob = new Blob([file], { type: file.type });
            setNewImage(cleanBlob)



            if (cleanBlob.size > 200 * 1024) {
                try {
                    const compressedImage = await compressImage(cleanBlob);
                    const compressedImageData = await readFileAsDataURL(compressedImage);
                    // setReceipt(compressedImageData); // Ensure this is set after compression

                    const base64String = await convertBlobToBase64(compressedImageData);

                    setExpense((prevExpense) => ({ ...prevExpense, receipt: base64String }));
                    // Update expense.receipt after compression is complete

                    setError("");
                } catch (error) {
                    console.error("Error compressing image:", error);
                    setError("Error compressing main image");
                }
            } else {

                const base64String = await convertBlobToBase64(cleanBlob);
                // setReceipt(file); // Directly set the image if it's small enough
                setExpense((prevExpense) => ({ ...prevExpense, receipt: base64String }));
                setError("");
            }
        }
    };



    // function to compress images
    const compressImage = (cleanBlob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(cleanBlob);
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
                            const compressedFile = new Blob([blob], { type: "image/jpeg" }); // No need for 'file'
                            resolve(compressedFile); // Resolve with compressed blob
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

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-green-100 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Add Expense</h2>

            {/* Loading Spinner */}
            {loading && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
                    <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
            )}
            {/* messages Pop - up  */}
            {messages && messages.length > 0 && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 p-4
                 bg-green-500 text-white rounded-lg shadow-md z-50">
                    <p>{messages}</p>
                </div>
            )}

            {/* Error Pop-up */}
            {error && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 p-4 bg-red-500 text-white rounded-lg shadow-md z-50">
                    <p>{error}</p>
                </div>
            )}
            <div className="mb-4">
                <label className="block font-medium mb-1">Expense Name/Title:</label>
                <input
                    type="text"
                    name="title"
                    value={expense.title}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter expense name"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block font-medium mb-1">Category:</label>
                <select
                    name="category"
                    value={expense.category}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value="">Select category</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Rent">Rent</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block font-medium mb-1">Amount:</label>
                <input
                    type="number"
                    name="amount"
                    value={expense.amount}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter amount"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block font-medium mb-1">Date of Expense:</label>
                <DatePicker
                    selected={expense.date}
                    onChange={handleDateChange}
                    className="w-full border rounded px-3 py-2"
                    placeholderText="Select date"
                    dateFormat="yyyy/MM/dd"
                    maxDate={new Date()}
                />
            </div>
            {/* payment method  */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Payment Method:</label>
                <select
                    name="paymentMethod"
                    value={expense.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value="">Select payment method</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                </select>
            </div>
            {/* remarks  */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Remarks/Notes:</label>
                <textarea
                    name="remarks"
                    value={expense.remarks}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter additional details (optional)"
                />
            </div>
            {/* receipt picker  */}


            <div className="flex flex-col items-center w-full mb-6">
                <h1 className="text-xl font-medium text-gray-500 mb-2">
                    Receipt picker
                </h1>
                <label
                    htmlFor="receiptPicker"
                    className="cursor-pointer w-full flex justify-center">
                    <div className="w-72 h-40 bg-gray-200 border-2 border-dashed rounded-lg
                     hover:border-blue-500 transition-colors duration-300 flex 
                     items-center justify-center">
                        {newImage ? (
                            <img
                                src={
                                    typeof newImage === "string" &&
                                        newImage.startsWith("data:")
                                        ? newImage
                                        : URL.createObjectURL(newImage)
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
                    id="receiptPicker"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                />
            </div>

            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
                Submit
            </button>
        </form>
    );
};

export default ExpenseForm;
