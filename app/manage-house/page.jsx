/** @format */
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// import { json } from "stream/consumers";

function Page() {
    const [error, setError] = useState(""); // State variable for error message
    const [apartments, setApartments] = useState([]);
    const router = useRouter();

    //search
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchSuccessMessage, setSearchSuccessMessage] = useState(""); // State variable for success message

    // const [searchUnseccessMessage, setSearchUnsuccessMessage] = useState("");
    const [searchUnsuccessMessage, setSearchUnsuccessMessage] = useState(""); // State variable for error message

    //
    //
    const [isButtonVisible, setIsButtonVisible] = useState(false);
    const [nameOfApartment, setNameOfApartmet] = useState("");
    const [apartmentsLocation, setApartmentsLocation] = useState("");

    // Function to show the button
    const showApartmentDetails = () => {
        // Add functionality to display apartment details
    };

    // Function to trigger showing the button (if needed)
    const showButton = (data) => {
        setIsButtonVisible(true);
    };
    const hideButton = (data) => {
        setIsButtonVisible(false);
    };

    //
    //

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSearchInputChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleSearch = async () => {
        try {
            // Perform actions with searchText, e.g., search functionality
            console.log("Searched for:", searchText);

            const response = await fetch("/api/searchApartment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ searchText }),
            });


            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                setSearchSuccessMessage();
            }

            const data = await response.json();

            const stringifiedData = JSON.stringify(data);

            // Log the stringified data
            console.log("Stringified Data:", stringifiedData);

            const parsedData = JSON.parse(stringifiedData);

            // Extract apartmentName from the parsed data and store it in a variable
            const apartmentName = parsedData.data.apartmentName;
            const apartmentLocation = parsedData.data.location;
            console.log("Apartment Name:", apartmentName, apartmentLocation);

            // Handle the response data based on your requirements

            // Example: Show a success message

            if (apartmentName && data.message) {
                setSearchSuccessMessage(data.message[0]);

                setTimeout(() => {
                    setSearchSuccessMessage("");
                }, 5000);

                setNameOfApartmet(apartmentName);
                setApartmentsLocation(apartmentLocation);
            } else {
                setSearchSuccessMessage("Searching error!!");
                hideButton();
            }

            // Example: Access data received from the server

            // closeModal(); // You might want to perform some actions here
        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle error or inform the user about the issue

            setSearchUnsuccessMessage(`HTTP error! Status: ${error.message}`);
            // Handle error or inform the user about the issue
            setTimeout(() => {
                setSearchUnsuccessMessage("");
            }, 3000);
        }
    };

    //
    //end of serach
    useEffect(() => {
        fetch("/api/getApartments", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Add other headers if required
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch apartments");
                }
                return response.json();
            })
            .then((data) => {
                setApartments(data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError("Failed to fetch apartments");
            });
    }, []);
    // methods
    const handleApartmentRooms = (_id) => {
        router.push(`/apartmentRooms?id=${_id}`);
        console.log(_id);
    };

    const handleUpdate = (id) => {
        console.log("Update apartment with ID:", id);
    };

    const handleDelete = (id) => {
        console.log("Delete apartment with ID:", id);
    };

    return (
        <div className="flex flex-col items-center h-screen overflow-scroll">
            <h1 className="font-bold text-3xl py-2">Available Apartments</h1>

            {/* Display Success Message */}
            {searchSuccessMessage && (
                <div className="bg-green-200 text-gray-800 rounded-lg fixed text-2xl  p-3 mt-4 ">
                    {searchSuccessMessage}
                </div>
            )}

            {/* Display Error Message */}
            {searchUnsuccessMessage && (
                <div className="bg-red-200 text-red-800 rounded-lg fixed text-2xl p-3 mt-4 ">
                    {searchUnsuccessMessage}
                </div>
            )}
            {error && <p>Error: {error}</p>}
            <div className="w-full flex justify-center">
                <table className="w-11/12 border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">ID</th>
                            <th className="border border-gray-300 px-4 py-2">
                                Apartment Name
                            </th>
                            <th className="border border-gray-300 px-4 py-2">Location</th>
                            {/* <th className="border border-gray-300 px-4 py-2">Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {apartments.map((apartment, index) => (
                            <tr key={apartment._id}>
                                <td className="border border-gray-300 px-4 py-2">
                                    {index + 1}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {apartment.apartmentName}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {apartment.location}
                                </td>
                                {/* <td className="border border-gray-300 px-2 py-2"></td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pt-4">
                <Link
                    className="bg-blue-500 rm-2 hover:bg-blue-700 p-2 px-6 rounded text-white font-bold text-2xl"
                    href="/Apartment">
                    Add Apartment
                </Link>
            </div>

            <div className="flex p-4 ">
                {/* start of serach button for view*/}

                <div>
                    <button
                        className="bg-green-300 hover:bg-green-600 text-white font-bold px-3 py-1 rounded mr-2"
                        onClick={openModal}>
                        View Apartment
                    </button>

                    {isModalOpen && (
                        <div className="fixed top-0 left-0 w-full h-full bg-gray-600 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-4 rounded">
                                <h1 className="text-xl flex justify-center u ">
                                    Enter apartment name{" "}
                                </h1>

                                {nameOfApartment && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                        <div className="w-4/5 sm:w-3/5 lg:w-2/5 bg-white rounded-lg shadow-lg">
                                            <div className="p-6">
                                                <h2 className="text-3xl font-bold mb-4 text-center">
                                                    {nameOfApartment}
                                                </h2>
                                                <div className="mb-4">
                                                    <p className="text-lg font-semibold">Location:</p>
                                                    <p>{apartmentsLocation}</p>
                                                </div>
                                                <div className="flex justify-center space-x-4">
                                                    <Link
                                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-center"
                                                        href={{
                                                            pathname: "/apartmentRooms",
                                                            query: {
                                                                apartmentName: nameOfApartment,
                                                                location: apartmentsLocation,
                                                            },
                                                        }}>
                                                        View Apartment Details
                                                    </Link>
                                                    <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg">
                                                        Close Window
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/*  */}
                                {/*  */}
                                <input
                                    type="text"
                                    value={searchText}
                                    onChange={handleSearchInputChange}
                                    className="border border-gray-400 p-2 mb-2"
                                    placeholder="Enter search text"
                                />
                                <div className="flex justify-end">
                                    <button
                                        className="bg-green-300 hover:bg-green-600 text-white font-bold px-3 py-1 rounded mr-2"
                                        onClick={handleSearch}>
                                        Search
                                    </button>



                                    <button
                                        className="bg-red-300 hover:bg-red-600 text-white font-bold px-3 py-1 rounded"
                                        onClick={closeModal}>
                                        Close
                                    </button>
                                </div>

                                <div></div>
                            </div>
                        </div>
                    )}
                </div>
                {/* end of search buttpn for view */}

                <div>
                    <button
                        className="bg-yellow-300 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded mr-2"
                        onClick={() => handleUpdate(apartment._id)}>
                        Update Apartment
                    </button>
                </div>
                <div>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mr-2"
                        onClick={() => handleDelete(apartment._id)}>
                        Delete Apartment
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Page;
