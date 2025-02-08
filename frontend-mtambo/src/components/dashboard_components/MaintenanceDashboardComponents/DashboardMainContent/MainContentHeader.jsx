import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useAuth } from '../../../../context/AuthenticationContext';

const MainContentHeader = () => {
    const { user } = useAuth();
    const userEmail = user ? user.email : '';
    const [loading, setLoading] = useState(true);


    // console.log(userEmail);
    const [companyName, setCompanyName] = useState('');

    useEffect(() => {
        if (userEmail) {
            // Fetch company details from the API
            axios.get(`http://127.0.0.1:8000/api/maintenance-companies/email/${userEmail}/`)
                .then(response => {
                    const companyData = response.data;
                    setCompanyName(companyData.company_name);
                    setLoading(false); // Set loading to false once data is fetched
                })
                .catch(error => {
                    console.error('Error fetching company details:', error);
                    setLoading(false); // Even if there's an error, stop loading
                });
        }
    }, [userEmail]);

    return (
        <div className="d-flex flex-column flex-md-row justify-content-between w-100">
            {/* Section for the dashboard name with bold and big text */}
            <div className="d-flex align-items-center mb-2 mb-md-0">
                <h3 className="display-6 font-weight-bold m-0">
                    {loading ? (
                        <Spinner animation="grow" variant="success"/>
                    ) : companyName}
                </h3>
            </div>

            {/* Section for buttons aligned to the right */}
            <div className="d-flex flex-wrap gap-2 ms-md-auto">
                <Link to="/dashboard/add-new-building" className="d-flex align-items-center btn btn-shadow btn-primary">
                    Add Building
                </Link>
                <a href='/dashboard/add-new-equipment' className="d-flex align-items-center btn btn-shadow btn-success">
                    Add Equipment
                </a>
            </div>
        </div>
    );
};

export default MainContentHeader;
