import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import './fullwidth.css'
import './styles/PageTransition.css'
// import './index.css'; // Eliminado porque ya no existe
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HomeUser } from './pages/home/Home.jsx';
import { UserDevicesPage } from './pages/devices/Devices.jsx';
import { PendientesProvider } from './context/PendientesContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PendientesProvider>
      <App />
    </PendientesProvider>
    <ToastContainer position="top-right" autoClose={3000} />
  </React.StrictMode>
);
