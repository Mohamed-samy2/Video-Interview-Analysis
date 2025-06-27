// src/routes/AppRoutes.jsx
import { createBrowserRouter, createRoutesFromElements, Route, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HrRoutes from './hr/routes/HrRoutes';
import UserRoutes from './user/routes/UserRoutes';
import CustomNavbar from './components/Navbar';
import Error from './pages/Error';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import LoginSignup from './hr/pages/LoginSignup';
import Header from './components/Header'
import UserNavbar from './components/UserNavbar';

// Layout for HR routes, About, Contact, and Error pages (includes navbar)
const RootLayout = () => {
  const { hrId } = useAuth();
  const isLoggedIn = !!hrId;
  return (
    <>
      <CustomNavbar isLoggedIn={isLoggedIn} />
      <Outlet />
    </>
  );
};


// Layout for User routes (includes UserNavbar)
const UserLayout = () => {
  return (
    <>
      <UserNavbar />
      <Outlet />
    </>
  );
};

// Layout for Login/Signup pages (includes Header)
const LoginLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes without navbar (HR login and register) */}
      {/* Routes with Header (Login and Register) */}
      <Route element={<LoginLayout />}>
        <Route path="/hr/login" element={<LoginSignup initialAction="Login" />} />
        <Route path="/hr/create" element={<LoginSignup initialAction="Sign Up" />} /> {/* Updated path to /hr/create */}
        <Route path="*" element={<Error />} />
      </Route>
      {/* <Route path="/hr/login" element={<LoginSignup initialAction="Login" />} />
      <Route path="/hr/register" element={<LoginSignup initialAction="Sign Up" />} /> */}



      Routes with navbar (HR routes, About, Contact, Error)
      <Route path="/hr" element={<RootLayout />}>
        {HrRoutes}
        {/* <Route path="about" element={<AboutUs />} /> */}
        {/* <Route path="contact" element={<Contact />} /> */}
        <Route path="*" element={<Error />} />
      </Route>

      {/* Routes with HR Navbar (HR routes, About, Contact, Error) */}
      <Route path="/hr" element={<RootLayout />}>
        {HrRoutes}
        {/* <Route path="about" element={<AboutUs />} /> */}
        {/* <Route path="contact" element={<Contact />} /> */}
        <Route path="*" element={<Error />} />
      </Route>


      {/* Routes with UserNavbar (User routes) */}
      <Route element={<UserLayout />}>
        {UserRoutes}
        <Route path="/" element={<UserRoutes />} />
        {/* <Route path="/about" element={<AboutUs />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
      </Route>
    </>
  )
);

export default router;
