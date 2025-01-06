'use client'
import { useState, useRef, useEffect } from 'react';
import React from 'react';
import AddUser from "@/app/Components/addClaerners"
import AssignRooms from "@/app/Components/assingnClaenersHouse"


const CleanersPage = () => {


	const [formattedData, setFormattedData] = useState([]);



	const containerRef = useRef(null);
	const [roomAssignments, setRoomAssignments] = useState()
	const [errors, setError] = useState([])
	useEffect(() => {


	}, [roomAssignments])





	useEffect(() => {
		if (roomAssignments && Array.isArray(roomAssignments)) {
			// Format the roomAssignments data
			const formatted = roomAssignments.map(({ cleanerName, roomsAssigned, createdAt }) => ({
				name: cleanerName,
				rooms: roomsAssigned,
				date: new Date(createdAt).toISOString().split("T")[0], // Extract the date part (YYYY-MM-DD)
			}));

			setFormattedData(formatted);
		}
	}, [roomAssignments]);





	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const totalPages = Math.ceil(formattedData.length / itemsPerPage);

	const paginatedData = formattedData.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const groupedData = paginatedData.reduce((acc, cleaner) => {
		const date = cleaner.date;
		acc[date] = acc[date] || [];
		acc[date].push(cleaner);
		return acc;
	}, {});

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [groupedData]);


	// fetching room assingments 
	// Fetch room assignments data
	useEffect(() => {
		const fetchRoomAssignments = async () => {
			try {
				const response = await fetch("/api/getRoomAssignments");
				const data = await response.json();


				if (data.success) {
					setRoomAssignments(data.data); // Assuming you have a state for room assignments
				} else {
					setError(data.error || "Failed to fetch room assignments.");
				}
			} catch (err) {
				setError("An unexpected error occurred while fetching room assignments.");
			}
		};

		fetchRoomAssignments();
	}, []);






	return (
		<div className="cleaner-table-container p-4 sm:p-6 bg-gray-100 min-h-screen">


			{/* div container for displaying the data  */}
			<div
				ref={containerRef}
				className="h-[75vh] overflow-y-auto p-4 sm:p-6 bg-gray-200 rounded-lg shadow-md"
			>
				{Object.keys(groupedData).map((date, index) => (
					<div key={index} className="table-section mb-8">
						<h2 className="table-section-title text-xl font-bold text-gray-700 mb-4">
							Date: {date}
						</h2>
						<div className="table-wrapper overflow-x-auto shadow-lg rounded-lg bg-white">
							<table className="table min-w-full">
								<thead>
									<tr className="bg-gray-200">
										<th className="table-header px-4 py-3 text-left text-gray-600 font-semibold border">
											Cleaner Name
										</th>
										<th className="table-header px-4 py-3 text-left text-gray-600 font-semibold border">
											Assigned Rooms
										</th>
									</tr>
								</thead>
								<tbody>
									{groupedData[date].map((cleaner, index) => (
										<tr
											key={index}
											className={`table-row ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
												} border-b`}
										>
											<td className="table-data px-4 py-3 text-gray-700">
												{cleaner.name}
											</td>
											<td className="table-data px-4 py-3">
												<ul className="room-list space-y-1 text-gray-700">
													{cleaner.rooms.map((room, index) => (
														<li
															key={index}
															className="room-item bg-gray-100 px-2 py-1 rounded"
														>
															{room}
														</li>
													))}
												</ul>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				))}
			</div>







			{/* div container for adding cleaner  */}

			<AssignRooms />

			{/* add new cleaners into the system  */}
			<AddUser />
		</div>
	);

};

export default CleanersPage;
