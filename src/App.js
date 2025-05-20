import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register'; // ✅ importado
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import Profile from './pages/Profile';
import AppRoutes from './routes';

function App() {
  return (
    <Router>
     <AppRoutes/>
    </Router>
  );
}

export default App;
