'use client';
import { useState, useEffect } from 'react';

const AddUser = () => {
    const [submitMessage, setSubmitMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // Manage submission state
    const [error, setError] = useState("");  // Error state

    const [formData, setFormData] = useState({
        firstName: '',
        secondName: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent multiple submissions

        // Validate input fields
        if (!formData.firstName || !formData.secondName) {
            alert("Please fill in both the first and second names.");
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare data for submission
            const userData = {
                firstName: formData.firstName,
                secondName: formData.secondName,
            };

            // Send data to the backend
            const response = await fetch("/api/addNewCleaners", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.msg || "Failed to add user. Please try again.");
            }

            // Success handling
            setSubmitMessage(responseData.msg || "User added successfully!");
            setFormData({ firstName: "", secondName: "" }); // Reset the form
            setError(""); // Clear any previous errors
        } catch (error) {
            console.error("Error:", error.message);
            setError(error.message); // Display the error
        } finally {
            setIsSubmitting(false); // Allow form submission again
        }
    };

    // Clear submitMessage after 5 seconds
    useEffect(() => {
        if (submitMessage) {
            const timer = setTimeout(() => setSubmitMessage(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [submitMessage]);

    // Clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div className="p-6 w-full bg-gray-200 min-h-auto">
            <div className="w-full mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Cleaner</h2>

                {/* Loading Overlay */}
                {isSubmitting && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="flex items-center space-x-4">
                            <div className="spinner border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
                            <p className="text-white font-semibold text-lg">Saving user...</p>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {submitMessage && (
                    <div className="mb-4 p-3 text-green-700 bg-green-100 rounded-lg">
                        {submitMessage}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* First Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none"
                            placeholder="Enter first name"
                        />
                    </div>

                    {/* Second Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Second Name</label>
                        <input
                            type="text"
                            name="secondName"
                            value={formData.secondName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none"
                            placeholder="Enter second name"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 rounded-lg text-white ${isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                            }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Add User"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
