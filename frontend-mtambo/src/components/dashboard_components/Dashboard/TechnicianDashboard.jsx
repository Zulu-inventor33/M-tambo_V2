import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { technicianDashboardSidebarLinks } from '../Sidebar/sidebarData';
import Footer from '../Footer';
import Header from '../Header/TopBar';
import Sidebar from '../Sidebar/Sidebar';
import './dashboard.css';

import TechnicianMainContentSection from '../TechniciansDashboardComponents/TechnicianMainContentSection';

const TechnicianDashboard = () => {
  return (
    <div className='maintencance-dashboard'>
      <Sidebar sidebarLinks={technicianDashboardSidebarLinks} />
      <Header />
      {/* Define the dynamic routes for the content area */}
      <Routes>
        {/* Default route */}
        <Route path="/" element={<TechnicianMainContentSection />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default TechnicianDashboard;