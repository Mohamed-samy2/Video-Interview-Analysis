// src/routes/AppRoutes.jsx
import { createBrowserRouter, createRoutesFromElements, Route,Outlet } from 'react-router-dom';
import React, { Suspense } from 'react';
import { useAuth } from '../context/AuthContext';

import CustomNavbar from '../components/Navbar';
import LoginSignup from '../pages/LoginSignup';
import CreateJob from '../pages/CreateJob';
import Home from '../pages/Homepage';
import Error from '../pages/Error';
import About from '../pages/AboutUs';
import Contact from '../pages/Contact';
import JobDetails from '../pages/JobDetails';
import YourProfile from '../pages/YourProfile';
import ProtectedRoute from '../components/ProtectedRoute';

// Simple layout component to include the Navbar
const RootLayout = () => {
    const { isLoggedIn } = useAuth();
    console.log(isLoggedIn)
    return (
      <>
        <CustomNavbar isLoggedIn={isLoggedIn} />
        <div className="container mt-3">
          <Outlet /> {/* Renders child routes */}
        </div>
      </>
    );
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
       <Route path="/login" element={<LoginSignup initialAction="Login" />} />
      <Route
        path="/create"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <LoginSignup initialAction="Sign Up" />
          </Suspense>
        }
      />
   
      <Route path="/" element={<RootLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <Home />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="about"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <About />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="contact"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <Contact />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="jobs/new"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <CreateJob />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="jobs/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <JobDetails />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <YourProfile />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Error />
            </Suspense>
          }
        />
      </Route>

      </>
    )
  );
  
  export default router;