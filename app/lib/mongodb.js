/** @format */

import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config(); // Load the .env file

const connectDB = async () => {
	try {
		if (mongoose.connection.readyState === 0) {
			await mongoose.connect(process.env.MONGO_URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
			console.log("db connected");
		}
	} catch (error) {
		console.log(error);
	}
};

export default connectDB;
