import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from '../Sidebar';
import '../../styles/layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout; 