import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

const Admin = lazy(() => import('./pages/Admin.jsx'));
const AllProducts = lazy(() => import('./pages/AllProducts/AllProducts.jsx'));

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div className="route-loader">Loading fresh experience...</div>}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/all-products" element={<AllProducts />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
