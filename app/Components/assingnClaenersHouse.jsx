'use client';
import { useState, useEffect } from 'react';

const AssignRooms = () => {
    const [cleaners, setCleaners] = useState([]);
    const [roomData, setRoomData] = useState([]);
    const [formData, setFormData] = useState({
        cleaner: "",
        rooms: [],
    });
    const [submitMessage, setSubmitMessage] = useState(""); // Success message
    const [error, setError] = useState(""); // Error message
    const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

    useEffect(() => {
        console.log(formData)
    }, formData)
    // Fetch cleaners data
    useEffect(() => {
        const fetchCleaners = async () => {
            try {
                const response = await fetch("/api/getCleaners");
                const data = await response.json();

                if (data.success) {
                    setCleaners(data.data);
                } else {
                    setError(data.error || "Failed to fetch cleaners.");
                }
            } catch (err) {
                setError("An unexpected error occurred while fetching cleaners.");
            }
        };

        fetchCleaners();
    }, []);

    // Fetch room data
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch("/api/getRooms");
                const data = await response.json();

                if (data.success) {
                    setRoomData(data.data.map(room => room.roomName)); // Extract room names
                } else {
                    setError(data.error || "Failed to fetch rooms.");
                }
            } catch (err) {
                setError("An unexpected error occurred while fetching rooms.");
            }
        };

        fetchRooms();
    }, []);

    // Handle input changes
    const handleCleanerChange = (e) => {
        setFormData({ ...formData, cleaner: e.target.value });
    };

    const handleRoomSelection = (e) => {
        const selectedRooms = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, rooms: selectedRooms });
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (!formData.cleaner || formData.rooms.length === 0) {
            setError("Please select a cleaner and at least one room.");

            return;
        }
        if (formData) {
            console.log(formData)
        }
        setIsSubmitting(true);
        setError("");
        setSubmitMessage("");

        try {
            const response = await fetch("/api/assignRooms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.msg || "Failed to assign rooms.");
            }

            setSubmitMessage(result.msg || "Rooms successfully assigned!");
            setFormData({ cleaner: "", rooms: [] });
        } catch (err) {
            setError(err.message); // Display backend error message
        } finally {
            setIsSubmitting(false);
        }
    };
    // Automatically clear messages after 4 seconds
    useEffect(() => {
        if (error || submitMessage) {
            const timer = setTimeout(() => {
                setError(null);
                setSubmitMessage("");
            }, 4000); // 4 seconds

            // Cleanup timer to avoid memory leaks
            return () => clearTimeout(timer);
        }
    }, [error, submitMessage]);

    return (
        <div className="p-6 w-full  bg-gray-200 min-h-auto">
            <div className="w-full mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Assign Rooms to Cleaners</h2>

                {/* Feedback Section */}
                {error && (
                    <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}
                {submitMessage && (
                    <div className="mb-4 p-3 text-green-700 bg-green-100 rounded-lg">
                        {submitMessage}
                    </div>
                )}


                <form onSubmit={handleSubmit}>
                    {/* Cleaner Dropdown */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Select Cleaner</label>
                        <select
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none"
                            value={formData.cleaner}
                            onChange={handleCleanerChange}
                        >
                            <option value="" disabled>
                                -- Select Cleaner --
                            </option>
                            {cleaners.map((cleaner, index) => (
                                <option
                                    key={index}
                                    value={`${cleaner.firstName} ${cleaner.secondName}`}
                                >
                                    {cleaner.firstName} {cleaner.secondName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Rooms Multi-Select */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Select Rooms</label>
                        <select
                            multiple
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none"
                            value={formData.rooms}
                            onChange={handleRoomSelection}
                        >
                            {roomData.map((room, index) => (
                                <option key={index} value={room}>
                                    {room}
                                </option>
                            ))}
                        </select>
                        <small className="text-gray-500 block mt-1">
                            Hold <kbd>Ctrl</kbd> (Windows) or <kbd>Cmd</kbd> (Mac) to select multiple rooms.
                        </small>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 rounded-lg text-white ${isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                            }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Assigning..." : "Assign Rooms"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AssignRooms;
