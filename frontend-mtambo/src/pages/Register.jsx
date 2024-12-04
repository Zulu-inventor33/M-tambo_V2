import React, { useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('');
  const [developerName, setDeveloperName] = useState('');
  const [address, setAddress] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyRegNumber, setCompanyRegNumber] = useState('');
  const [equipmentSpecialization, setEquipmentSpecialization] = useState('');
  const [affiliatedCompany, setAffiliatedCompany] = useState('');
  const [error, setError] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Handle form validation
  const validateForm = () => {
    let formErrors = { ...error };
    let valid = true;

    if (!email) {
      formErrors.email = 'Email is required';
      valid = false;
    }

    if (!firstName) {
      formErrors.firstName = 'First name is required';
      valid = false;
    }

    if (!lastName) {
      formErrors.lastName = 'Last name is required';
      valid = false;
    }

    if (!phone) {
      formErrors.phone = 'Phone number is required';
      valid = false;
    }

    if (!password) {
      formErrors.password = 'Password is required';
      valid = false;
    }

    if (password !== confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setError(formErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted');
      // Add your API request or form submission logic here
    }
  };

  return (
    <div className='relative bg-gray-100 overflow-hidden'>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6 overflow-y-auto">
          <h3 className="text-2xl pb-2 text-[#fc4b3b] text-center font-semibold mb-6 border-b-2 border-[#2c2c64]">Welcome to M-tambo please register to Join our platform.</h3>
          {/* Form section starts here */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Column 1 */}
              <div className="col-span-1">
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${error.email ? 'border-red-500' : ''}`}
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {error.email && <span className="text-red-500 text-sm">{error.email}</span>}
                </div>

                <div className="mb-4">
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${error.firstName ? 'border-red-500' : ''}`}
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  {error.firstName && <span className="text-red-500 text-sm">{error.firstName}</span>}
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${error.phone ? 'border-red-500' : ''}`}
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  {error.phone && <span className="text-red-500 text-sm">{error.phone}</span>}
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${error.password ? 'border-red-500' : ''}`}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {error.password && <span className="text-red-500 text-sm">{error.password}</span>}
                </div>
              </div>

              {/* Column 2 */}
              <div className="col-span-1">
                <div className="mb-4">
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${error.lastName ? 'border-red-500' : ''}`}
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                  {error.lastName && <span className="text-red-500 text-sm">{error.lastName}</span>}
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${error.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {error.confirmPassword && <span className="text-red-500 text-sm">{error.confirmPassword}</span>}
                </div>

                <div className="mb-4">
                  <label htmlFor="accountType" className="block text-sm font-semibold text-gray-700">Account Type</label>
                  <select
                    id="accountType"
                    name="accountType"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b]"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                  >
                    <option value="">Select Account Type</option>
                    <option value="developer">Developer</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="technician">Technician</option>
                  </select>
                </div>

                {/* Conditionally Render Developer Fields */}
                {accountType === 'developer' && (
                  <div className="mb-4">
                    <label htmlFor="developerName" className="block text-sm font-semibold text-gray-700">Developer Name</label>
                    <input
                      type="text"
                      id="developerName"
                      name="developerName"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b]"
                      placeholder="Developer Name"
                      value={developerName}
                      onChange={(e) => setDeveloperName(e.target.value)}
                    />
                  </div>
                )}

                {/* Conditionally Render Maintenance Fields */}
                {accountType === 'maintenance' && (
                  <>
                    <div className="mb-4">
                      <label htmlFor="specialization" className="block text-sm font-semibold text-gray-700">Specialization</label>
                      <select
                        id="specialization"
                        name="specialization"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b]"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                      >
                        <option value="">Select Specialization</option>
                        <option value="hvac">HVAC</option>
                        <option value="lifts">LIFTS</option>
                        <option value="generators">GENERATORS</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700">Company Name</label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b]"
                        placeholder="Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="companyAddress" className="block text-sm font-semibold text-gray-700">Company Address</label>
                      <input
                        type="text"
                        id="companyAddress"
                        name="companyAddress"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b]"
                        placeholder="Company Address"
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="companyRegNumber" className="block text-sm font-semibold text-gray-700">Company Reg Number</label>
                      <input
                        type="text"
                        id="companyRegNumber"
                        name="companyRegNumber"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b]"
                        placeholder="Company Registration Number"
                        value={companyRegNumber}
                        onChange={(e) => setCompanyRegNumber(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* Conditionally Render Technician Fields */}
                {accountType === 'technician' && (
                  <>
                    <div className="mb-4">
                      <label htmlFor="equipmentSpecialization" className="block text-sm font-semibold text-gray-700">Equipment Specialization</label>
                      <input
                        type="text"
                        id="equipmentSpecialization"
                        name="equipmentSpecialization"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b]"
                        placeholder="Equipment Specialization"
                        value={equipmentSpecialization}
                        onChange={(e) => setEquipmentSpecialization(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="affiliatedCompany" className="block text-sm font-semibold text-gray-700">Affiliated Maintenance Company</label>
                      <input
                        type="text"
                        id="affiliatedCompany"
                        name="affiliatedCompany"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b]"
                        placeholder="Affiliated Company"
                        value={affiliatedCompany}
                        onChange={(e) => setAffiliatedCompany(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Submit and Reset buttons */}
            <div className="mt-6 flex justify-between">
              <button type="submit" className="bg-[#fc4b3b] text-white py-2 px-4 rounded-lg hover:bg-[#fc4b3b]/80">
                Register
              </button>
              <button type="reset" className="bg-[#2c2c64] text-white py-2 px-4 rounded-lg hover:bg-gray-400">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;