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
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-luxury-black text-white selection:bg-gold selection:text-black">
          <Navbar />
          <NightMode />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/100-citas" element={<ProtectedRoute><DatesPage /></ProtectedRoute>} />
            <Route path="/nuestro-viaje" element={<ProtectedRoute><LimaTrip /></ProtectedRoute>} />
            <Route path="/momento-especial" element={<ProtectedRoute><SpecialMoment /></ProtectedRoute>} />
          </Routes>
          <MusicPlayer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
