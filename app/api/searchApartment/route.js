/** @format */
import apartmentDetails from "@/app/models/apartment";
import { NextResponse } from "next/server";

import connectDB from "@/app/lib/mongodb";

export async function POST(req) {
  if (req.method !== "POST") {
    return NextResponse.error({
      status: 405,
      message: "Method not allowed",
    });
  }

  try {
    await connectDB(); // Assuming connectDB is a function that connects to the database

    const { searchText } = await req.json();
    console.log(searchText)

    const searchedApartment = await apartmentDetails.findOne({
      apartmentName: new RegExp(`^${searchText}$`, "i"), // Using RegExp for case-insensitive search
    });

    if (!searchedApartment) {
      return NextResponse.json({
        message: ["Apartment cannot be found in the database"],
      });
    }

   

    return NextResponse.json({
      message: ["Search successful"],
      data: searchedApartment, // Returning the found apartment
    });
  } catch (error) {
    console.error("Error searching for apartments:", error);
    return NextResponse.error({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

// /** @format */

// import apartmentDetails from "@/app/models/apartment";
// import { NextResponse } from "next/server";

// import connectDB from "@/app/lib/mongodb";
// // import User from "@/app/models/users";
// // import { NextResponse } from "next/server";
// // import mongoose from "mongoose";
// // import bcrypt from "bcryptjs";
// // import jwt from "jsonwebtoken"; // Import the jwt module
// // /**
// //  * Handles POST request to submit contact form data.
// //  * @param {Object} req - HTTP request object containing form data
// //  * @returns {Object} JSON response indicating success or error
// //  */

// export async function POST(req) {
//   if (req.method !== "POST") {
//     return NextResponse.error({
//       status: 405,
//       message: "Method not allowed",
//     });
//   }

//   const searchText = await req.json();
//   console.log(searchText);
// }
// try {
//   //connect to database
//   await connectDB;

//   const searchedApartment = await apartmentDetails.find({
//     apartmentName,
//     searchText,
//   });

//   // If apartments with the specified apartmentName are found, 'searchedApartment' will contain the results
//   console.log(searchedApartment);

//   // if no apartment i the databse

//   if (!searchedApartment) {
//     return NextResponse.json({
//       message: ["Apartment cannont be found in the databse"],
//     });
//   }

//   // the there is one apartment
//   return NextResponse.jason({
//     message: ["Search successfull"],
//     data: apartmentDetails.apartmentName,
//   });
// } catch (error) {
//   // Handle errors if the query encounters any issues
//   console.error("Error searching for apartments:", error);
// }

//     // Generate a JWT token if the username and password are valid
//     const token = jwt.sign({ userId: user._id }, "your_secret_key", {
//       expiresIn: "1h",
//     });
//     // Assuming 'token' is received in the login response

//     // Return a successful response with token and user data (status code: 200)
//     return NextResponse.json({
//       msg: ["User logged in successfully"],
//       success: true,
//       token: token,
//       userData: {
//         username: user.username,
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,

//         // ...other relevant user data
//       },
//     });
//   } catch (error) {
//     // Handle errors and return an error response (status code: 500)
//     console.error(error);
//     return NextResponse.json(
//       { msg: ["Unable to perform login"], success: false },
//       { status: 500 }
//     );
//   }
// }
