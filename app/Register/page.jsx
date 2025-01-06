"use client"
import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    passportId: '',
    phoneNumber: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.username = formData.username ? '' : 'Username is required';
    tempErrors.firstName = formData.firstName ? '' : 'First Name is required';
    tempErrors.lastName = formData.lastName ? '' : 'Last Name is required';
    tempErrors.dateOfBirth = formData.dateOfBirth ? '' : 'Date of Birth is required';
    tempErrors.gender = formData.gender ? '' : 'Gender is required';
    tempErrors.nationality = formData.nationality ? '' : 'Nationality is required';
    tempErrors.passportId = formData.passportId ? '' : 'Passport/ID Number is required';
    tempErrors.phoneNumber = formData.phoneNumber ? '' : 'Phone Number is required';
    tempErrors.email = /\S+@\S+\.\S+/.test(formData.email) ? '' : 'Email is not valid';
    tempErrors.street = formData.street ? '' : 'Street is required';
    tempErrors.city = formData.city ? '' : 'City is required';
    tempErrors.state = formData.state ? '' : 'State is required';
    tempErrors.zipCode = formData.zipCode ? '' : 'Zip/Postal Code is required';
    tempErrors.country = formData.country ? '' : 'Country is required';
    tempErrors.password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)
      ? ''
      : 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character';
    tempErrors.confirmPassword = formData.confirmPassword === formData.password ? '' : 'Passwords do not match';
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form data:', formData);
      // Submit form data to the server
    }
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="  pb-2 mb-4">


            {/* user name field */}
            <label className="block text-gray-400">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.username && <span className="text-red-500">{errors.username}</span>}
          </div>

          {/* first name filds */}
          <div className="pb-4 mb-4">
            <label className="block text-gray-400">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.firstName && <span className="text-red-500">{errors.firstName}</span>}
          </div>
          {/* last name field  */}
          <div className="pb-2 mb-4">
            <label className="block text-gray-400">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.lastName && <span className="text-red-500">{errors.lastName}</span>}
          </div>

          {/* Date of birth fields  */}
          <div className="p-2 mb-4">
            <label className="block text-gray-400">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.dateOfBirth && <span className="text-red-500">{errors.dateOfBirth}</span>}
          </div>

          {/* gender fields  */}
          <div className=" p-2 mb-4">
            <label className="block text-gray-400">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <span className="text-red-500">{errors.gender}</span>}
          </div>

          {/* Nationality field  */}
          <div className="mb-4 p-2 ">
            <label className="block text-gray-400">Nationality</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.nationality && <span className="text-red-500">{errors.nationality}</span>}
          </div>

          {/* passport/id fields  */}
          <div className="p-2 mb-4">
            <label className="block text-gray-400">Passport/ID Number</label>
            <input
              type="text"
              name="passportId"
              value={formData.passportId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.passportId && <span className="text-red-500">{errors.passportId}</span>}
          </div>

          {/* phone number fields  */}
          <div className="mb-4 p-2 ">
            <label className="block text-gray-400">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber}</span>}
          </div>

          {/* email field  */}
          <div className="p-2 mb-4">
            <label className="block text-gray-400">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.email && <span className="text-red-500">{errors.email}</span>}
          </div>

          {/* street field  */}
          <div className="p-2 mb-4">
            <label className="block text-gray-400">Street</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.street && <span className="text-red-500">{errors.street}</span>}
          </div>

          {/* city fields  */}
          <div className="p-2 mb-4">
            <label className="block text-gray-400">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.city && <span className="text-red-500">{errors.city}</span>}
          </div>

{/* state fields  */}
          <div className="mb-4">
            <label className="block text-gray-400">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.state && <span className="text-red-500">{errors.state}</span>}
          </div>

          {/* Zip/Postal Cod  */}
          <div className=" p-2 mb-4">
            <label className="block text-gray-400">Zip/Postal Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
                        {errors.zipCode && <span className="text-red-500">{errors.zipCode}</span>}
          </div>
          {/* country fields  */}
          <div className="mb-4 p-2 ">
            <label className="block text-gray-400">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.country && <span className="text-red-500">{errors.country}</span>}
          </div>

          {/* pasword fields  */}
          <div className="mb-4 p-2 ">
            <label className="block text-gray-400">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.password && <span className="text-red-500">{errors.password}</span>}
          </div>

          {/* confirm password fields  */}
          <div className="mb-4 p-2">
            <label className="block text-gray-400">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword}</span>}
          </div>

          {/* submit button  */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
