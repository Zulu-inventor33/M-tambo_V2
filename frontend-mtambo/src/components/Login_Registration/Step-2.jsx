import React from 'react';

const Step2 = ({ formData, handleInputChange, handleSpecializationChange, maintenanceCompanies, setFormData }) => {
    const handleSelectChange = (event) => {
        const selectedCompanyId = event.target.value;
        const selectedCompany = maintenanceCompanies.find(company => company.id === parseInt(selectedCompanyId));

        setFormData({
            ...formData,
            affiliatedCompany: selectedCompany.company_name,
            maintenance_company_id: selectedCompany.id,
        });
    };
    // if the account type is maintenance render Maintenance Fields
    const renderMaintenanceFields = () => (
        <>
            <div className="form-group mb-3">
                <label htmlFor="companyName" className="form-label">Company Name*</label>
                <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="form-control"
                />
            </div>
            <div className="form-group mb-3">
                <label htmlFor="companyAddress" className="form-label">Company Address*</label>
                <input
                    type="text"
                    id="companyAddress"
                    name="companyAddress"
                    placeholder="Company Address"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                    className="form-control"
                />
            </div>
            <div className="form-group mb-3">
                <label htmlFor="companyRegNumber" className="form-label">Company registration number*</label>
                <input
                    type="text"
                    id="companyRegNumber"
                    name="companyRegNumber"
                    placeholder="Company registration number"
                    value={formData.companyRegNumber}
                    onChange={handleInputChange}
                    className="form-control"
                />
            </div>
            {/* Specialization Field for Maintenance */}
            <div className='login-page-new__main-form-row'>
                <div className="form-group">
                    <label htmlFor="accountTypeSelect">Choose Specialization*</label>
                    <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="form-select form-control-lg"
                    >
                        {/* Placeholder option */}
                        <option value="" disabled selected>Choose specialization</option>
                        {['Elevators', 'HVAC', 'Power Backup Generators'].map((specialization) => (
                            <option key={specialization} value={specialization}>
                                {specialization}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    );
    // if the account type is developer render Developer Fields
    const renderDeveloperFields = () => (
        <>
            <div className="form-group mb-3">
                <label htmlFor="developerName" className="form-label">Developer Name*</label>
                <input
                    type="text"
                    id="developerName"
                    name="developerName"
                    value={formData.developerName}
                    onChange={handleInputChange}
                    placeholder="Developer Name"
                    className="form-control"
                />
            </div>
            <div className="form-group mb-3">
                <label htmlFor="developerAddress" className="form-label">Developer Address*</label>
                <input
                    type="text"
                    id="developerAddress"
                    name="developerAddress"
                    value={formData.developerAddress}
                    onChange={handleInputChange}
                    placeholder="Developer Address"
                    className="form-control"
                />
            </div>
        </>
    );
    // if the account type is technician render Technician Fields
    const renderTechnicianFields = () => (
        <>
            <div className='login-page-new__main-form-row'>
                <div className="form-group">
                    <label htmlFor="accountTypeSelect">Choose Specialization*</label>
                    <select
                        name="equipmentSpecialization"
                        value={formData.equipmentSpecialization}
                        onChange={handleSpecializationChange}
                        className="form-select form-control-lg"
                    >
                        {/* Placeholder option */}
                        <option value="" disabled selected>Choose specialization</option>

                        {['Elevators', 'HVAC', 'Power Backup Generators'].map((specialization) => (
                            <option key={specialization} value={specialization}>
                                {specialization}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Maintenance Company Selection */}
            <div className='login-page-new__main-form-row'>
                <div className="form-group">
                    <label htmlFor="accountTypeSelect">Choose a maintenance company*</label>
                    <select
                        value={formData.affiliatedCompany}
                        onChange={handleSelectChange}
                        className="form-select form-control-lg"
                    >
                        <option value="" disabled>Select a company</option>
                        {maintenanceCompanies.map((company) => (
                            <option key={company.id} value={company.id}>
                                {company.company_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

        </>
    );

    return (
        <>
            <div className="form-group">
                <label htmlFor="accountTypeSelect">Select Account Type*</label>
                <select
                    id="accountTypeSelect"
                    name="accountType"
                    className="form-select form-control-lg"
                    value={formData.accountType}
                    onChange={handleInputChange}
                >
                    {/* Placeholder option */}
                    <option value="" disabled selected>Select Account Type</option>

                    <option value="developer">Developer</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="technician">Technician</option>
                </select>
            </div>
            {formData.accountType === 'maintenance' && renderMaintenanceFields()}
            {formData.accountType === 'developer' && renderDeveloperFields()}
            {formData.accountType === 'technician' && renderTechnicianFields()}
        </>
    );
};

export default Step2;