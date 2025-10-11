import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

import 'primereact/resources/themes/lara-light-blue/theme.css';   // Tema visual
import 'primereact/resources/primereact.min.css';                 // Componentes base
import 'primeicons/primeicons.css';                               // Iconos
import 'primeflex/primeflex.css';                                 // Utilidades de grid/flex


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);

reportWebVitals();
