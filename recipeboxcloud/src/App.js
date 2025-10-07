import { Route, Routes } from 'react-router-dom';
import './App.css';

import Login from './Components/Login/Login';
import Registro from './Components/Registro/Registro';
import Home from './Components/Home/Home';
import Favoritas from './Components/Recetas/Favoritas';
import Crear from './Components/Recetas/Crear';
import MisRecetas from './Components/Recetas/mis-recetas';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Registro />} />
      <Route path="/home" element={<Home />} />
      <Route path="/favoritos" element={<Favoritas />} />
      <Route path="/nueva" element={<Crear />} />
      <Route path="/mis-recetas" element={<MisRecetas />} />
    </Routes>
  );
}

export default App;
