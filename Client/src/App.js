import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import LoginForm from './pages/Auth/loginForm';
import RegisterForm from './pages/Auth/registerForm';
import ProfilePage from './pages/Profile/Profile';
import WorkoutPage from './pages/Workouts/Workouts';
import NutritionLogsPage from './pages/Nutrition/NutritionLogsPage'; 

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/workouts" element={
          <ProtectedRoute>
            <WorkoutPage />
          </ProtectedRoute>
        } />
        <Route path="/nutrition-logs" element={
          <ProtectedRoute>
            <NutritionLogsPage />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;