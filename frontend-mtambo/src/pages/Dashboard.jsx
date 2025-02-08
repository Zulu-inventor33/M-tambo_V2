import React from 'react';

import { useAuth } from '../context/AuthenticationContext';
import MaintenanceDashboard from '../components/dashboard_components/Dashboard/MaintenanceDashboard';
import TechnicianDashboard from '../components/dashboard_components/Dashboard/TechnicianDashboard';
import DeveloperDashboard from '../components/dashboard_components/Dashboard/DeveloperDashboard';
import AdminDashboard from '../components/dashboard_components/Dashboard/AdminDashboard';


const Dashboard = ({ setProgress }) => {
	const { user } = useAuth();

	if (!user) {
		return <div>No user is available from dashboard page Loading...</div>;
	}
	// Render dashboard based on account type
	switch (user.account_type) {
		case 'technician':
			return (
				<div>
					<TechnicianDashboard setProgress={setProgress} />
				</div>
			);
		case 'developer':
			return (
				<div>
					<DeveloperDashboard setProgress={setProgress} />
				</div>
			);
		case 'maintenance':
			return (
				<div>
					<MaintenanceDashboard setProgress={setProgress} />
				</div>
			);
		case 'administrator':
			return (
				<div>
					<AdminDashboard  setProgress={setProgress} />
				</div>
			);
		default:
			// Fallback in case account type is not recognized
			return <div>Unauthorized Access from dashboard pages</div>;
	}
};

export default Dashboard;