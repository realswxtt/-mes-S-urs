import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SpecialMoment from './pages/SpecialMoment';
import DatesPage from './pages/DatesPage';
import LimaTrip from './pages/LimaTrip';
import LoginPage from './pages/LoginPage';
import MusicPlayer from './components/MusicPlayer';
import NightMode from './components/NightMode';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-luxury-black text-white selection:bg-gold selection:text-black">
          <Navbar />
          <NightMode />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/100-citas" element={<DatesPage />} />
            <Route path="/nuestro-viaje" element={<LimaTrip />} />
            <Route path="/momento-especial" element={<SpecialMoment />} />
          </Routes>
          <MusicPlayer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
