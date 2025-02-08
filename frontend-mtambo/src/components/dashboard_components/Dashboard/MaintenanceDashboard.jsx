import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { maintenanceDashboardSidebarLinks } from '../Sidebar/sidebarData';
import Footer from '../Footer';
import Header from '../Header/TopBar';
import Sidebar from '../Sidebar/Sidebar';
import './dashboard.css';

import DashboardMainContent from '../MaintenanceDashboardComponents/DashboardMainContent/DashboardMainContent';
import RegularSchedule from '../MaintenanceDashboardComponents/Schedules/RegularSchedule';
import AdHocSchedules from '../MaintenanceDashboardComponents/Schedules/AdHocSchedules';
import CreateMaintenanceSchedule from '../MaintenanceDashboardComponents/Schedules/CreateMaintenanceSchedule';
import CompletedJobs from '../MaintenanceDashboardComponents/CompletedJobs/CompletedJobs';
import ProfileContent from '../MaintenanceDashboardComponents/ProfileContent';
import AddNewBuilding from '../MaintenanceDashboardComponents/AddNewBuilding/AddNewBuilding';
import AddNewEquipment from '../MaintenanceDashboardComponents/AddNewEquipment';
import TechniciansDashboard from '../MaintenanceDashboardComponents/Technicians/TechniciansDashboard';
import CreateMaintenanceTask from '../MaintenanceDashboardComponents/CreateMaintenanceTask';
import Reports from '../MaintenanceDashboardComponents/Reports';
import Calendar from '../MaintenanceDashboardComponents/Calendar/Calendar';
import OverdueJobs from '../MaintenanceDashboardComponents/OverdueJobs';
import CompanyBuildings from '../MaintenanceDashboardComponents/Buildings/BuildingsList';
import AddElevator from '../MaintenanceDashboardComponents/AddElevator/AddElevator';
import SpecificBuildingElevators from '../MaintenanceDashboardComponents/Buildings/SpecificBuildingElevators';

const MaintenanceDashboard = ({ setProgress }) => {
	return (
		<div className='maintencance-dashboard'>
			<Sidebar sidebarLinks={maintenanceDashboardSidebarLinks} />
			<Header />
			{/* Define the dynamic routes for the content area */}
			<Routes>
				{/* Default route */}
				<Route path="/" element={<DashboardMainContent setProgress={setProgress} />} />
				<Route path="profile" element={<ProfileContent setProgress={setProgress} />} />
				<Route path="regular-schedules" element={<RegularSchedule setProgress={setProgress} />} />
				<Route path="regular-schedules/create-maintenance-schedule" element={<CreateMaintenanceSchedule setProgress={setProgress} />} />
				<Route path="ad-hoc-schedules" element={<AdHocSchedules setProgress={setProgress} />} />
				<Route path="completed-jobs" element={<CompletedJobs setProgress={setProgress} />} />
				<Route path="overdue-jobs" element={<OverdueJobs setProgress={setProgress} />} />
				<Route path="add-new-building" element={<AddNewBuilding setProgress={setProgress} />} />
				<Route path="add-elevator" element={<AddElevator setProgress={setProgress} />} />
				<Route path="buildings" element={<CompanyBuildings setProgress={setProgress} />} />
				<Route path="buildings/elevators" element={<SpecificBuildingElevators setProgress={setProgress} />} />
				<Route path="add-new-equipment" element={<AddNewEquipment setProgress={setProgress} />} />
				<Route path="technicians" element={<TechniciansDashboard setProgress={setProgress} />} />
				<Route path="create-maintenance-task" element={<CreateMaintenanceTask setProgress={setProgress} />} />
				<Route path="reports" element={<Reports setProgress={setProgress} />} />
				<Route path="calendar" element={<Calendar setProgress={setProgress} />} />
			</Routes>
			<Footer />
		</div>
	);
};

export default MaintenanceDashboard;