import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { developerDashboardSidebarLinks } from '../Sidebar/sidebarData';
import Footer from '../Footer';
import Header from '../Header/TopBar';
import Sidebar from '../Sidebar/Sidebar';
import './dashboard.css';

import DeveloperMainContentSection from '../DeveloperDashboard/DeveloperMainContentSection';

const DeveloperDashboard = () => {
  return (
    <div className='maintencance-dashboard'>
      <Sidebar sidebarLinks={developerDashboardSidebarLinks} />
      <Header />
      {/* Define the dynamic routes for the content area */}
      <Routes>
        {/* Default route */}
        <Route path="/" element={<DeveloperMainContentSection />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default  DeveloperDashboard;
