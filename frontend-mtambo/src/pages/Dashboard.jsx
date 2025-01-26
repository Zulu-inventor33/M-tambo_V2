import React from 'react';

import { useAuth } from '../context/AuthenticationContext';
import MaintenanceDashboard from '../components/dashboard_components/Dashboard/MaintenanceDashboard';
import TechnicianDashboard from '../components/dashboard_components/Dashboard/TechnicianDashboard';
import DeveloperDashboard from '../components/dashboard_components/Dashboard/DeveloperDashboard';
import AdminDashboard from '../components/dashboard_components/Dashboard/AdminDashboard';


const Dashboard = () => {
	const { user } = useAuth(); // Get user data from context

	if (!user) {
		// If user data is not available, you can redirect or show a loading state
		return <div>No user is available from dashboard page Loading...</div>;
	}

	// Render dashboard based on account type
	switch (user.account_type) {
		case 'technician':
			return (
				<div>
					<TechnicianDashboard />
				</div>
			);
		case 'developer':
			return (
				<div>
					<DeveloperDashboard />
				</div>
			);
		case 'maintenance':
			return (
				<div>
					<MaintenanceDashboard />
				</div>
			);
		case 'administrator':
			return (
				<div>
					<AdminDashboard />
				</div>
			);
		default:
			// Fallback in case account type is not recognized
			return <div>Unauthorized Access from dashboard pages</div>;
	}
};

export default Dashboard;