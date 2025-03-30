// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [hrId, setHrId] = useState(() => {
    const storedHrId = localStorage.getItem('hrId');
    return storedHrId && storedHrId !== '0' ? storedHrId : null;
  });
  const [role, setRole] = useState(() => localStorage.getItem('role') || null); // 'hr' or null
  const [isLoggedIn, setIsLoggedIn] = useState(!!hrId);

  useEffect(() => {
    if (hrId && hrId !== '0') {
      localStorage.setItem('hrId', hrId);
      localStorage.setItem('role', 'hr');
      setRole('hr');
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('hrId');
      localStorage.removeItem('role');
      localStorage.removeItem('hrDetails');
      localStorage.removeItem('jobId');
      setHrId(null);
      setRole(null);
      setIsLoggedIn(false);
    }
  }, [hrId]);

  const logout = () => {
    setHrId(null);
    setRole(null);
    setIsLoggedIn(false);
    localStorage.removeItem('hrId');
    localStorage.removeItem('role');
    localStorage.removeItem('hrDetails');
    localStorage.removeItem('jobId');
    toast.success('Logged out successfully!');
  };

  return (
    <AuthContext.Provider value={{ hrId, setHrId, role, setRole, isLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

