import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Index from './pages/Index'
import FacturasAccordionPage from './pages/FacturasAccordionPage'
import FacturasFiltroPage from './pages/FacturasFiltroPage'
import FacturasPage from './pages/FacturasPage';
import CrearFacturasPage from './pages/CrearFacturasPage';

const App = () => {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Index />}/>
        <Route path="*" element={<Index />}/>
        <Route path="/facturas-accordion" element={<FacturasAccordionPage />}/>
        <Route path="/facturas-filtro" element={<FacturasFiltroPage />}/>
        <Route path="/facturas" element={<FacturasPage />}/>
        <Route path="/crear-facturas" element={<CrearFacturasPage />}/>
      </Routes> 
    </Router>
  );  
};

export default App
