import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [hrId, setHrId] = useState(() => {
    const storedHrId = localStorage.getItem('hrId');
    return storedHrId && storedHrId !== '0' ? storedHrId : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!hrId);

  useEffect(() => {
    if (hrId && hrId !== '0') {
      localStorage.setItem('hrId', hrId);
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('hrId');
      localStorage.removeItem('hrDetails');
      setHrId(null);
      setIsLoggedIn(false);
    }
  }, [hrId]);

  const logout = () => {
    setHrId(null);
    toast.success('Logged out successfully!');
  };

  return (
    <AuthContext.Provider value={{ hrId, setHrId, isLoggedIn, logout }}>
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

