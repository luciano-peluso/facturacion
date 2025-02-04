import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Index from './pages/Index'
import FacturasAccordionPage from './pages/facturas/FacturasAccordionPage'
import FacturasFiltroPage from './pages/facturas/FacturasFiltroPage'

import VerFacturasPage from './pages/facturas/VerFacturasPage';
import CrearFacturasPage from './pages/facturas/CrearFacturasPage';
import TotalesPage from './pages/facturas/TotalesPage';

import CrearOSPage from './pages/os/CrearOSPage';
import VerOSPage from './pages/os/VerOSPage';

import VerTutoresPage from './pages/tutores/VerTutoresPage';
import CrearTutoresPage from './pages/tutores/CrearTutoresPage';

import VerPacientesPage from './pages/pacientes/VerPacientesPage';
import CrearPacientesPage from './pages/pacientes/CrearPacientesPage';
import ConfiguracionPage from './pages/ConfiguracionPage';

const App = () => {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Index />}/>
        <Route path="*" element={<Index />}/>
        <Route path="/facturas-accordion" element={<FacturasAccordionPage />}/>
        <Route path="/facturas-filtro" element={<FacturasFiltroPage />}/>
        <Route path="/calcular-totales" element={<TotalesPage/>}/>

        <Route path="/crear-facturas" element={<CrearFacturasPage />}/>
        <Route path="/ver-facturas" element={<VerFacturasPage />}/>
        
        <Route path="/crear-obras-sociales" element={<CrearOSPage />}/>
        <Route path="/ver-obras-sociales" element={<VerOSPage />}/>

        <Route path="/crear-encargado" element={<CrearTutoresPage />}/>
        <Route path="/ver-encargado" element={<VerTutoresPage />}/>

        <Route path="/crear-pacientes" element={<CrearPacientesPage />}/>
        <Route path="/ver-pacientes" element={<VerPacientesPage />}/>

        <Route path="/configuracion" element={<ConfiguracionPage />} />
      </Routes> 
    </Router>
  );  
};

export default App
