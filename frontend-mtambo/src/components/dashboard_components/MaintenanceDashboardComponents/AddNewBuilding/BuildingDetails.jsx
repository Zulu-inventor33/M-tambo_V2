import React from 'react';
import Select from 'react-select';

import LoadingCard from '../../LoadingCard';
import ErrorCard from '../../ErrorCard';

const BuildingDetails = ({ 
    handleNextStep, 
    allDevelopers, 
    formData, 
    selectedDeveloper, 
    handleChange, 
    handleDeveloperChange, 
    loadingDevelopers, 
    errorLoadingDevelopers 
}) => {
    return (
        <form id="validation-forms">
            {loadingDevelopers && (
                <LoadingCard />
            )}

            {errorLoadingDevelopers && !loadingDevelopers && (
                <ErrorCard />
            )}

            {!loadingDevelopers && !errorLoadingDevelopers && (
                <>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Select a Developer</label>
                                <Select
                                    options={allDevelopers}
                                    value={selectedDeveloper}
                                    onChange={handleDeveloperChange}
                                    placeholder="Select a developer"
                                    isSearchable
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Building Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`form-control`}
                                    placeholder="Enter Building Name"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Building Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className={`form-control`}
                                    placeholder="Enter Building Location"
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Address</label>
                                <input
                                    className={`form-control`}
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter Address"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Contact</label>
                                <input
                                    className={`form-control`}
                                    type="text"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    placeholder="Enter Contact"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 d-flex justify-content-end align-items-center">
                        <button type="button" className="btn btn-primary" onClick={handleNextStep}>Next To Elevator Details</button>
                    </div>
                </>
            )}
        </form>
    );
}
export default BuildingDetails;