import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Index from './pages/Index'
import FacturasAccordionPage from './pages/FacturasAccordionPage'
import FacturasFiltroPage from './pages/FacturasFiltroPage'

import VerFacturasPage from './pages/FacturasPage';
import CrearFacturasPage from './pages/CrearFacturasPage';

import CrearOSPage from './pages/CrearOSPage';
import VerOSPage from './pages/VerOSPage';

import VerTutoresPage from './pages/VerTutoresPage';
import CrearTutoresPage from './pages/CrearTutoresPage';

import VerPacientesPage from './pages/VerPacientesPage';
import CrearPacientesPage from './pages/CrearPacientesPage';

const App = () => {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Index />}/>
        <Route path="*" element={<Index />}/>
        <Route path="/facturas-accordion" element={<FacturasAccordionPage />}/>
        <Route path="/facturas-filtro" element={<FacturasFiltroPage />}/>

        <Route path="/crear-facturas" element={<CrearFacturasPage />}/>
        <Route path="/ver-facturas" element={<VerFacturasPage />}/>
        
        <Route path="/crear-obras-sociales" element={<CrearOSPage />}/>
        <Route path="/ver-obras-sociales" element={<VerOSPage />}/>

        <Route path="/crear-tutores" element={<CrearTutoresPage />}/>
        <Route path="/ver-tutores" element={<VerTutoresPage />}/>

        <Route path="/crear-pacientes" element={<CrearPacientesPage />}/>
        <Route path="/ver-pacientes" element={<VerPacientesPage />}/>
      </Routes> 
    </Router>
  );  
};

export default App
