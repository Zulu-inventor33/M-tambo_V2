import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { maintenanceDashboardSidebarLinks } from '../Sidebar/sidebarData';
import Footer from '../Footer';
import Header from '../Header/TopBar';
import Sidebar from '../Sidebar/Sidebar';
import './dashboard.css';

import DashboardMainContent from '../MaintenanceDashboardComponents/DashboardMainContent';
import JobManagement from '../MaintenanceDashboardComponents/JobManagement';
import ProfileContent from '../MaintenanceDashboardComponents/ProfileContent';
import AddNewBuilding from '../MaintenanceDashboardComponents/AddNewBuilding';
import AddNewEquipment from '../MaintenanceDashboardComponents/AddNewEquipment';
import TechniciansDashboard from '../MaintenanceDashboardComponents/Technicians/TechniciansDashboard';
import CreateMaintenanceTask from '../MaintenanceDashboardComponents/CreateMaintenanceTask';
import Reports from '../MaintenanceDashboardComponents/Reports';
import Calendar from '../MaintenanceDashboardComponents/Calendar/Calendar';
import CompletedJobs from '../MaintenanceDashboardComponents/CompletedJobs';
import OverdueJobs from '../MaintenanceDashboardComponents/OverdueJobs';
import UpcomingJobs from '../MaintenanceDashboardComponents/UpcomingJobs';

const MaintenanceDashboard = () => {
  return (
    <div className='maintencance-dashboard'>
      <Sidebar sidebarLinks={maintenanceDashboardSidebarLinks} />
      <Header />
      {/* Define the dynamic routes for the content area */}
      <Routes>
        {/* Default route */}
        <Route path="/" element={<DashboardMainContent />} />
        <Route path="profile" element={<ProfileContent />} />
        <Route path="job-management" element={<JobManagement />} />
        <Route path="completed-jobs" element={<CompletedJobs />} />
        <Route path="upcoming-jobs" element={<UpcomingJobs />} />
        <Route path="overdue-jobs" element={<OverdueJobs  />} />
        <Route path="add-new-building" element={<AddNewBuilding />} />
        <Route path="buildings" element={<TechniciansDashboard />} />
        <Route path="add-new-equipment" element={<AddNewEquipment />} />
        <Route path="technicians" element={<TechniciansDashboard />} />
        <Route path="create-maintenance-task" element={<CreateMaintenanceTask />} />
        <Route path="reports" element={<Reports />} />
        <Route path="calendar" element={<Calendar />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default MaintenanceDashboard;