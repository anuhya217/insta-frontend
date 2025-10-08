import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import BottomNavigation from './BottomNavigation';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const location = useLocation();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Top Navigation */}
      <TopNavigation 
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
      />
      
      <div className="flex">
        {/* Sidebar for desktop */}
        <div className="hidden lg:flex">
          <Sidebar />
        </div>
        
        {/* Main content */}
        <main className="flex-1 pt-[60px] lg:pt-0 lg:ml-64 pb-[50px] lg:pb-0">
          {children}
        </main>
      </div>
      
      {/* Bottom Navigation for mobile */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Layout;