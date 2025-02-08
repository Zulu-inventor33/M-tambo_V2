import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { technicianDashboardSidebarLinks } from '../Sidebar/sidebarData';
import Footer from '../Footer';
import Header from '../Header/TopBar';
import Sidebar from '../Sidebar/Sidebar';
import './dashboard.css';
import TechnicianBuildings from '../TechniciansDashboardComponents/Buildings/TechnicianBuildings';
import TechnicianSchedules from '../TechniciansDashboardComponents/Schedules/TechnicianSchedules';
import FileMaintenanceLog from '../TechniciansDashboardComponents/Schedules/FileMaintenanceLog';
import TechnicianMainContentSection from '../TechniciansDashboardComponents/TechnicianMainContentSection';
import TechnicianCompletedSchedules from '../TechniciansDashboardComponents/CompletedTasks/TechnicianCompletedSchedules';

const TechnicianDashboard = ({ setProgress }) => {
	return (
		<div className='maintencance-dashboard'>
			<Sidebar sidebarLinks={technicianDashboardSidebarLinks} />
			<Header />
			{/* Define the dynamic routes for the content area */}
			<Routes>
				{/* Default route */}
				<Route path="/" element={<TechnicianMainContentSection  setProgress={setProgress} />} />
				<Route path="technician/buildings" element={<TechnicianBuildings setProgress={setProgress} />} />
				<Route path="technician/my-schedules" element={<TechnicianSchedules setProgress={setProgress} />} />
				<Route path="technician/file-maintenance-log/:scheduleId" element={<FileMaintenanceLog setProgress={setProgress} />}  />
				<Route path="technician/completed-schedules" element={<TechnicianCompletedSchedules setProgress={setProgress} />}  />
			</Routes>
			<Footer />
		</div>
	);
};

export default TechnicianDashboard;