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
        <Route path="add-new-building" element={<AddNewBuilding />} />
        <Route path="add-new-equipment" element={<AddNewEquipment />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default MaintenanceDashboard;