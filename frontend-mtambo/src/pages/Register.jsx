import React, { useState } from 'react';
import axios from 'axios';
import { notifySuccess, notifyError } from '../utils/notificationUtils';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  // Initialize useNavigate hook
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: '',
    developerName: '',
    developerAddress: '',
    specialization: '',
    companyName: '',
    companyAddress: '',
    companyRegNumber: '',
    equipmentSpecialization: '',
    affiliatedCompany: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let errors = {};
    let valid = true;

    if (!formData.email) {
      errors.email = 'Email is required';
      valid = false;
    }

    if (!formData.firstName) {
      errors.firstName = 'First name is required';
      valid = false;
    }

    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
      valid = false;
    }

    if (!formData.phone) {
      errors.phone = 'Phone number is required';
      valid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
        account_type: formData.accountType,
      };

      if (formData.accountType === 'developer') {
        userData.developer_name = formData.developerName;
        userData.address = formData.developerAddress;
      } else if (formData.accountType === 'maintenance') {
        userData.company_name = formData.companyName;
        userData.company_address = formData.companyAddress;
        userData.company_registration_number = formData.companyRegNumber;
        userData.specialization = formData.specialization;
      } else if (formData.accountType === 'technician') {
        userData.equipment_specialization = formData.equipmentSpecialization;
        userData.affiliated_company = formData.affiliatedCompany;
      }

      console.log("Data to be submitted:", JSON.stringify(userData));

      try {
        const response = await axios.post('http://localhost:8000/api/signup/', JSON.stringify(userData), {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        notifySuccess("Registration successful! Welcome to M-tambo.");
        console.log("User registered successfully:", response.data);
        setLoading(false);
        navigate('/login');
      } catch (error) {
        setLoading(false);
        const errorMessage = error.response?.data?.error || 'Something went wrong!';
        console.log("Error message:", errorMessage);
        notifyError(errorMessage);
        if (error.response?.data?.error === 'A user with this email already exists.') {
          setErrors(prevErrors => ({
            ...prevErrors,
            email: 'A user with this email already exists.',
          }));
        } else {
          notifyError(errorMessage);
        }
      }
    } else {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      confirmPassword: '',
      accountType: '',
      developerName: '',
      developerAddress: '',
      specialization: '',
      companyName: '',
      companyAddress: '',
      companyRegNumber: '',
      equipmentSpecialization: '',
      affiliatedCompany: '',
    });
    setErrors({});
  };

  return (
    <div className="relative bg-gray-100 overflow-hidden w-full h-full">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6 md:max-h-[580px] overflow-y-auto max-w-4xl mx-auto">
          <h3 className="text-2xl pb-2 text-[#fc4b3b] text-center font-semibold mb-6 border-b-2 border-[#2c2c64]">
            Welcome to M-tambo please register to join our platform.
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Column 1 */}
              <div className="col-span-1">
                {/* Email field */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                </div>

                {/* First Name field */}
                <div className="mb-4">
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
                </div>

                {/* Last Name field */}
                <div className="mb-4">
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
                </div>
              </div>

              {/* Column 2 */}
              <div className="col-span-1">
                {/* Phone field */}
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
                </div>

                {/* Password field */}
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                </div>

                {/* Confirm Password field */}
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>}
                </div>

                {/* Account Type field */}
                <div className="mb-4">
                  <label htmlFor="accountType" className="block text-sm font-semibold text-gray-700">Account Type</label>
                  <select
                    id="accountType"
                    name="accountType"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${errors.accountType ? 'border-red-500' : ''}`}
                    value={formData.accountType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Account Type</option>
                    <option value="developer">Developer</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="technician">Technician</option>
                  </select>
                  {errors.accountType && <span className="text-red-500 text-sm">{errors.accountType}</span>}
                </div>
              </div>

              {/* Conditional Fields Based on Account Type */}
              {formData.accountType === 'developer' && (
                <>
                  <div className="mb-4">
                    <label htmlFor="developerName" className="block text-sm font-semibold text-gray-700">Developer Name</label>
                    <input
                      type="text"
                      id="developerName"
                      name="developerName"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${errors.developerName ? 'border-red-500' : ''}`}
                      placeholder="Developer Name"
                      value={formData.developerName}
                      onChange={handleInputChange}
                    />
                    {errors.developerName && <span className="text-red-500 text-sm">{errors.developerName}</span>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="developerAddress" className="block text-sm font-semibold text-gray-700">Developer Address</label>
                    <input
                      type="text"
                      id="developerAddress"
                      name="developerAddress"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${errors.developerAddress ? 'border-red-500' : ''}`}
                      placeholder="Developer Address"
                      value={formData.developerAddress}
                      onChange={handleInputChange}
                    />
                    {errors.developerAddress && <span className="text-red-500 text-sm">{errors.developerAddress}</span>}
                  </div>
                </>
              )}

              {formData.accountType === 'maintenance' && (
                <>
                  <div className="mb-4">
                    <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700">Company Name</label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${errors.companyName ? 'border-red-500' : ''}`}
                      placeholder="Company Name"
                      value={formData.companyName}
                      onChange={handleInputChange}
                    />
                    {errors.companyName && <span className="text-red-500 text-sm">{errors.companyName}</span>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="companyAddress" className="block text-sm font-semibold text-gray-700">Company Address</label>
                    <input
                      type="text"
                      id="companyAddress"
                      name="companyAddress"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${errors.companyAddress ? 'border-red-500' : ''}`}
                      placeholder="Company Address"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                    />
                    {errors.companyAddress && <span className="text-red-500 text-sm">{errors.companyAddress}</span>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="companyRegNumber" className="block text-sm font-semibold text-gray-700">Company Registration Number</label>
                    <input
                      type="text"
                      id="companyRegNumber"
                      name="companyRegNumber"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${errors.companyRegNumber ? 'border-red-500' : ''}`}
                      placeholder="Company Registration Number"
                      value={formData.companyRegNumber}
                      onChange={handleInputChange}
                    />
                    {errors.companyRegNumber && <span className="text-red-500 text-sm">{errors.companyRegNumber}</span>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="specialization" className="block text-sm font-semibold text-gray-700">Specialization</label>
                    <input
                      type="text"
                      id="specialization"
                      name="specialization"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${errors.specialization ? 'border-red-500' : ''}`}
                      placeholder="Specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                    />
                    {errors.specialization && <span className="text-red-500 text-sm">{errors.specialization}</span>}
                  </div>
                </>
              )}

              {formData.accountType === 'technician' && (
                <>
                  <div className="mb-4">
                    <label htmlFor="equipmentSpecialization" className="block text-sm font-semibold text-gray-700">Equipment Specialization</label>
                    <input
                      type="text"
                      id="equipmentSpecialization"
                      name="equipmentSpecialization"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${errors.equipmentSpecialization ? 'border-red-500' : ''}`}
                      placeholder="Equipment Specialization"
                      value={formData.equipmentSpecialization}
                      onChange={handleInputChange}
                    />
                    {errors.equipmentSpecialization && <span className="text-red-500 text-sm">{errors.equipmentSpecialization}</span>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="affiliatedCompany" className="block text-sm font-semibold text-gray-700">Affiliated Company</label>
                    <input
                      type="text"
                      id="affiliatedCompany"
                      name="affiliatedCompany"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${errors.affiliatedCompany ? 'border-red-500' : ''}`}
                      placeholder="Affiliated Company"
                      value={formData.affiliatedCompany}
                      onChange={handleInputChange}
                    />
                    {errors.affiliatedCompany && <span className="text-red-500 text-sm">{errors.affiliatedCompany}</span>}
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-center gap-3 items-center mt-4">
              <button
                type="submit"
                className="bg-[#2c2c64] text-white py-2 px-4 rounded-lg hover:bg-[#fc4b3b]"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-[#fc4b3b] text-white py-2 px-4 rounded-lg hover:bg-[#2c2c64]"
              >
                Reset
              </button>
            </div>
            <div className="mt-6 text-center mb-3">
              <p className="text-gray-700">Already have an account? <a href="/login" className="text-[#fc4b3b]">Login</a></p>
            </div>
            {errors.server && <div className="text-red-500 mt-4">{errors.server}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;