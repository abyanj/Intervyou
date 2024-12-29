import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import Dashboard from './pages/Dashboard';
import './App.css'
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
