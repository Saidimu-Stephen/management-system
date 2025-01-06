"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
	BuildingOfficeIcon,
	UserGroupIcon,
	HomeIcon,
	ArrowRightOnRectangleIcon,
	ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link"; // Import Link from Next.js
import { FaBars } from "react-icons/fa"; // For the menu icon
import {
	FaFileAlt,
	FaChartLine,
	FaBroom,
	FaMoneyBillWave,
	FaClipboardList,
	FaCalendarAlt,
	FaDollarSign,
	FaClipboardCheck,
} from "react-icons/fa";

function Page() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const router = useRouter();
	return (
		<div className="h-screen bg-gray-100 flex flex-col gap-2 relative">
			{/* Sidebar */}
			<div
				className={`p-4 transition-all duration-300 z-50
				${sidebarOpen ? "top-0" : "-top-full"} 
				bg-gradient-to-r from-gray-700 to-gray-800 text-white
				border border-gray-400 rounded-lg
				absolute w-full h-auto lg:w-64 lg:h-auto`}
				style={{ left: 0 }}>
				<div className="text-center">
					<div className="text-lg font-bold">
						<button
							className="bg-blue-500 text-white font-semibold border text-2xl
							border-blue-700 rounded-md px-6 py-2 shadow-md w-full
							hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2
							focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
							onClick={() => setSidebarOpen(false)} // Close sidebar
						>
							Dashboard
						</button>
					</div>

					<div className="flex items-center flex-col gap-2 py-2">
						{[
							{
								label: "Daily report",
								icon: <FaFileAlt />,
								path: "/Daily-report",
							},
							{ label: "Analysis", icon: <FaChartLine />, path: "/Analysis" },
							{ label: "Cleaning", icon: <FaBroom />, path: "/Cleaning" },
							{
								label: "Payments",
								icon: <FaMoneyBillWave />,
								path: "/Payments",
							},
							{
								label: "Expenses",
								icon: <FaClipboardList />,
								path: "/Expenses",
							},
							{ label: "Earnings", icon: <FaDollarSign />, path: "/Earnings" },
							{
								label: "Bookings",
								icon: <FaClipboardCheck />,
								path: "/Bookings",
							},
							{
								label: "Calendar",
								icon: <FaCalendarAlt />, // Calendar icon
								path: "/Calendar", // Path for the calendar page
							},
						].map((item, index) => (
							<button
								key={index}
								className="flex items-center text-left p-2 hover:bg-gray-600 text-xl text-white rounded-md transition-all duration-300
					transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
								onClick={() => router.push(item.path)} // Redirect to the corresponding page
							>
								<span className="mr-2">{item.icon}</span>
								{item.label}
							</button>
						))}
					</div>

					{/* Close button  */}
					<div className="pt-4">
						<button
							className="p-2 bg-gradient-to-r from-red-500 to-red-700
              w-full text-white rounded-md shadow-md transition-all duration-300
			transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300"
							onClick={() => {
								setSidebarOpen(false); // Close the sidebar
							}}>
							Close
						</button>
					</div>
				</div>
			</div>
			{/* Main Content */}
			<div className="flex flex-row p-4  relative">
				<div className=" ">
					<button
						className="p-2 bg-gray-800 text-white rounded-md shadow-md"
						onClick={() => {
							setSidebarOpen(!sidebarOpen); // Toggle sidebar visibility
							if (!sidebarOpen) setSidebarOpen(true); // If not open, open it
						}}>
						<FaBars size={24} />
					</button>
				</div>
				<div className="w-full text-center mb-8">
					<h1 className="text-2xl font-bold text-blue-600 p-2 rounded-md transition-transform transform hover:scale-105">
						Task Management System
					</h1>
				</div>
			</div>
			{/* cards to manage other activities  */}

			<div className="container mx-auto p-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
					{/* Manage Apartments */}
					<Link href="/manage-apartments">
						<div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg hover:bg-blue-50 transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center justify-center text-center">
							<BuildingOfficeIcon className="h-8 w-8 text-blue-500 mb-2" />
							<div className="text-lg text-black font-semibold mb-4">
								Manage Apartments
							</div>
							<p className="text-gray-600">
								Overview and control of all apartments.
							</p>
						</div>
					</Link>

					{/* Manage Cleaners */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						{/* Manage Cleaners Card */}
						<Link href="/manage-cleaners">
							<div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg hover:bg-blue-50 transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center justify-center text-center">
								<UserGroupIcon className="h-8 w-8 text-blue-500 mb-2" />
								<div className="text-lg text-black font-semibold mb-4">
									Manage Cleaners
								</div>
								<p className="text-gray-600">
									Assign tasks and manage cleaning schedules.
								</p>
							</div>
						</Link>

						{/* Manage House Card */}
						<Link href="/manage-house">
							<div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg hover:bg-blue-50 transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center justify-center text-center">
								<HomeIcon className="h-8 w-8 text-blue-500 mb-2" />
								<div className="text-lg text-black font-semibold mb-4">
									Manage House
								</div>
								<p className="text-gray-600">
									Manage the houses and properties.
								</p>
							</div>
						</Link>
					</div>

					{/* Check-Ins Today */}
					<Link href="/check-ins-today">
						<div className="bg-blue-100 shadow-md rounded-lg p-6 hover:shadow-lg hover:bg-blue-200 transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center justify-center text-center">
							<ArrowRightOnRectangleIcon className="h-8 w-8 text-blue-500 mb-2" />
							<div className="text-lg font-semibold mb-4 text-black">
								Check-Ins Today
							</div>
							<p className="text-gray-600">View today&apos;s check-ins.</p>
						</div>
					</Link>

					{/* Check-Outs Today */}
					<Link href="/check-outs-today">
						<div className="bg-yellow-100 shadow-md rounded-lg p-6 hover:shadow-lg hover:bg-yellow-200 transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center justify-center text-center">
							<ArrowLeftOnRectangleIcon className="h-8 w-8 text-yellow-500 mb-2" />
							<div className="text-lg font-semibold mb-4 text-black">
								Check-Outs Today
							</div>
							<p className="text-gray-600">View today&apos;s check-outs.</p>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Page;
