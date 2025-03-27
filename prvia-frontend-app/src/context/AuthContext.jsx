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


// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { toast } from 'react-toastify';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [hrId, setHrId] = useState(() => {
//     const storedHrId = localStorage.getItem('hrId');
//     return storedHrId && storedHrId !== '0' ? storedHrId : null;
//   });
//   const [userId, setUserId] = useState(() => {
//     const storedUserId = localStorage.getItem('userId');
//     return storedUserId && storedUserId !== '0' ? storedUserId : null;
//   });
//   const [role, setRole] = useState(() => localStorage.getItem('role') || null); // 'hr' or 'user'
//   const [isLoggedIn, setIsLoggedIn] = useState(!!hrId || !!userId);

//   useEffect(() => {
//     if (hrId && hrId !== '0') {
//       localStorage.setItem('hrId', hrId);
//       localStorage.setItem('role', 'hr');
//       setRole('hr');
//       setUserId(null); // Ensure userId is cleared
//       localStorage.removeItem('userId');
//       setIsLoggedIn(true);
//     } 
//   else if (userId && userId !== '0') {
//       localStorage.setItem('userId', userId);
//       localStorage.setItem('role', 'user');
//       setRole('user');
//       setHrId(null); // Ensure hrId is cleared
//       localStorage.removeItem('hrId');
//       setIsLoggedIn(true);
//     } 
//     else {
//       localStorage.removeItem('hrId');
//       localStorage.removeItem('userId');
//       localStorage.removeItem('role');
//       localStorage.removeItem('hrDetails');
//       localStorage.removeItem('userDetails');
//       setHrId(null);
//       setUserId(null);
//       setRole(null);
//       setIsLoggedIn(false);
//     }
//   }, [hrId, userId]);

//   const logout = () => {
//     setHrId(null);
//     setUserId(null);
//     setRole(null);
//     localStorage.removeItem('hrId');
//     localStorage.removeItem('hrDetails');
//     localStorage.removeItem('role');
//     localStorage.removeItem('jobId');
//     toast.success('Logged out successfully!');
//   };

//   return (
//     <AuthContext.Provider value={{ hrId, setHrId, userId, setUserId, role,setRole, isLoggedIn, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [hrId, setHrId] = useState(() => {
//     const storedHrId = localStorage.getItem('hrId');
//     return storedHrId && storedHrId !== '0' ? storedHrId : null;
//   });
//   const [isLoggedIn, setIsLoggedIn] = useState(!!hrId);

//   useEffect(() => {
//     if (hrId && hrId !== '0') {
//       localStorage.setItem('hrId', hrId);
//       setIsLoggedIn(true);
//     } else {
//       localStorage.removeItem('hrId');
//       localStorage.removeItem('hrDetails');
//       setHrId(null);
//       setIsLoggedIn(false);
//     }
//   }, [hrId]);

//   const logout = () => {
//     setHrId(null);
//     toast.success('Logged out successfully!');
//   };

//   return (
//     <AuthContext.Provider value={{ hrId, setHrId, isLoggedIn, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
