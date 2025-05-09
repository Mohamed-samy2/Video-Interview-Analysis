// src/routes/AppRoutes.jsx
import { createBrowserRouter, createRoutesFromElements, Route, Outlet } from 'react-router-dom';
import React from 'react';
import { useAuth } from './context/AuthContext';
import HrRoutes from './hr/routes/HrRoutes';
import UserRoutes from './user/routes/UserRoutes';
import CustomNavbar from './components/Navbar';
import Error from './pages/Error';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import LoginSignup from './hr/pages/LoginSignup';

// Layout for HR routes, About, Contact, and Error pages (includes navbar)
const RootLayout = () => {
  const { hrId } = useAuth();
  const isLoggedIn = !!hrId; // Derive isLoggedIn from hrId
  console.log('isLoggedIn:', isLoggedIn);
  return (
    <>
      <CustomNavbar isLoggedIn={isLoggedIn} />
        <Outlet />
    </>
  );
};

// Layout for User routes (no navbar)
const UserLayout = () => {
  return (
      <Outlet />
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes without navbar (HR login and register) */}
      <Route path="/hr/login" element={<LoginSignup initialAction="Login" />} />
      <Route path="/hr/register" element={<LoginSignup initialAction="Sign Up" />} />
      <Route path="*" element={<Error />} />

      {/* Routes with navbar (HR routes, About, Contact, Error) */}
      <Route path="/hr" element={<RootLayout />}>
        {HrRoutes}
        <Route path="about" element={<AboutUs />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<Error />} />
      </Route>

      {/* Routes without navbar (User routes) */}
      <Route element={<UserLayout />}>
      <Route path="about" element={<AboutUs />} />
      <Route path="contact" element={<Contact />} />
        {UserRoutes}
      </Route>
    </>
  )
);

export default router;
