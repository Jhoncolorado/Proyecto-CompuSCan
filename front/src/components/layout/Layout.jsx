import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div className="container-fluid p-0 min-vh-100 bg-light">
      <Header />
      <div className="d-flex justify-content-center align-items-start bg-light" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="w-100" style={{ maxWidth: 900, marginTop: 40 }}>
          <div className="bg-white rounded-4 shadow p-4 mb-4" style={{ minHeight: 500 }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout; 