// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [hrId, setHrId] = useState(localStorage.getItem('hrId') || null);

  useEffect(() => {
    if (hrId) {
      localStorage.setItem('hrId', hrId);
    } else {
      localStorage.removeItem('hrId');
    }
  }, [hrId]);

  const logout = () => {
    localStorage.removeItem('hrId');
    setHrId(null);
  };

  return (
    <AuthContext.Provider value={{ hrId, setHrId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


// import React, { createContext, useState, useContext } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

