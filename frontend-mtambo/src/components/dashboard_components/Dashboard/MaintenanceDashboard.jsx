import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { maintenanceDashboardSidebarLinks } from '../Sidebar/sidebarData';
import Footer from '../Footer';
import Header from '../Header/TopBar';
import Sidebar from '../Sidebar/Sidebar';
import './dashboard.css';

import DashboardMainContent from '../MaintenanceDashboard/DashboardMainContent';
import JobManagement from '../MaintenanceDashboard/JobManagement';
import ProfileContent from '../MaintenanceDashboard/ProfileContent';
import AddNewBuilding from '../MaintenanceDashboard/AddNewBuilding';
import AddNewEquipment from '../MaintenanceDashboard/AddNewEquipment';


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