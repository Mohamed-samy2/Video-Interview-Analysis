//src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export const HrProtectedRoute = ({ children }) => {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn || role !== 'hr') {
    return <Navigate to="/hr/login" replace />;
  }

  return children;
};

// export const UserProtectedRoute = ({ children }) => {
//   const { userId, role } = useAuth();

//   if (!userId || role !== 'user') {
//     return <Navigate to="/apply" replace />;
//   }

//   return children;
// };

// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const ProtectedRoute = ({ children }) => {
//   const { isLoggedIn } = useAuth();
//   return isLoggedIn ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;
