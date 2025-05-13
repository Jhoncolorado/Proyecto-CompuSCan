import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  const location = useLocation();
  const isDevices = location.pathname.startsWith('/devices');
  const isUsers = location.pathname.startsWith('/users');

  const useFullWidth = isDevices || isUsers;

  return (
    <div className="container-fluid p-0 min-vh-100 bg-light">
      <Header />
      <div className="main-content" style={{ marginTop: 60 }}>
        <div className="d-flex justify-content-center bg-light">
          <div className="w-100" style={useFullWidth ? {} : { maxWidth: 900 }}>
            <div className="bg-white rounded-4 shadow p-4 mb-4">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout; 