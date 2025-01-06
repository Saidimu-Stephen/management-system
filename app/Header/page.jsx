"use client";
import React from "react";
import { FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation";

import { FaUserCircle, FaBell, FaBars } from "react-icons/fa"; // Import icons from react-icons
import "./Header.css";
const Header = () => {
	const router = useRouter();
	return (
		<header className="bg-gray-200 p-2 border-bottom shadow-md">
			<div className="flex flex-row justify-between align-items-center">
				{/* the left container section  */}
				<div className="flex   flex-row gap-3">
					{/* Logo or Title */}
					<div
						className="app-title text-blue-400 flex items-center cursor-pointer mb-4"
						onClick={() => router.push("/")} // Navigate to home page
					>
						<FaHome className="mr-2" /> {/* Home icon */}
						Dashboard
					</div>
					{/* Nav Button for small screens */}
					<button
						className="btn btn-outline-primary pb-5 justify-center d-lg-none"
						aria-label="Toggle navigation">
						<FaBars size={16} />
					</button>
				</div>

				{/* the right container section  */}
				{/* Icons Section */}
				<div className="flex  align-items-end gap-3">
					{/* Notification Icon with Status */}
					<div className="position-relative  bg-green-400 me-4">
						<FaBell size={24} />
						{/* Notification Badge */}
						{/* <span
  className="position-absolute badge rounded-pill bg-danger"
  style={{ 
    fontSize: '0.75rem', 
    top: '-5px', // Adjust this value to move it up
    right: '-10px' // Adjust this value to move it to the right
  }}
>
  3
</span> */}
					</div>

					{/* Profile Icon */}
					<FaUserCircle size={30} />
				</div>
			</div>
		</header>
	);
};

export default Header;
