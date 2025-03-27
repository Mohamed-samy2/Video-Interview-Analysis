// // src/routes/AppRoutes.jsx
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
      <div className="container mt-3">
        <Outlet />
      </div>
    </>
  );
};

// Layout for User routes (no navbar)
const UserLayout = () => {
  return (
    <div className="container mt-3">
      <Outlet />
    </div>
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

// import { createBrowserRouter, createRoutesFromElements, Route, Outlet } from 'react-router-dom';
// import React from 'react';
// import { useAuth } from './context/AuthContext';
// import HrRoutes from './hr/routes/HrRoutes';
// import UserRoutes from './user/routes/UserRoutes';
// import CustomNavbar from './components/Navbar';
// import Error from './pages/Error';
// import AboutUs from './pages/AboutUs';
// import Contact from './pages/Contact';
// import LoginSignup from './hr/pages/LoginSignup';
// import Home from './hr/pages/Homepage'; // HR Homepage
// import UserHome from './user/pages/UserHomePage';


// // Component to decide which homepage to render
// const HomePage = () => {
//   const { isLoggedIn, role } = useAuth();

//   // If the user is logged in as HR, render the HR homepage
//   if (isLoggedIn && role === 'hr') {
//     return <Home />;
//   }

//   // Otherwise, render the user homepage
//   return <UserHome />;
// };


// // Layout for HR routes, About, Contact, and Error pages (includes navbar)
// const RootLayout = () => {
//   const { hrId } = useAuth();
//   const isLoggedIn = !!hrId; // Derive isLoggedIn from hrId
//   console.log('isLoggedIn:', isLoggedIn);
//   return (
//     <>
//       <CustomNavbar isLoggedIn={isLoggedIn} />
//       <div className="container mt-3">
//         <Outlet />
//       </div>
//     </>
//   );
// };
// // Layout for User routes (no navbar)
// const UserLayout = () => {
//   return (
//     <div className="container mt-3">
//       <Outlet />
//     </div>
//   );
// };

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//       {/* Routes without navbar (HR login and register) */}
//       <Route path="/hr/login" element={<LoginSignup initialAction="Login" />} />
//       <Route path="/hr/register" element={<LoginSignup initialAction="Sign Up" />} />
//       <Route path="*" element={<Error />} />

//       {/* Routes with navbar (HR routes, About, Contact, Error) */}
//       <Route path="/" element={<RootLayout />}>
//         {/* Render the appropriate homepage */}
//         <Route index element={<HomePage />} />
//         {/* Filter out login and register routes from HrRoutes */}
//         {HrRoutes.props.children.filter(route => 
//           route.props.path !== '/hr/login' && route.props.path !== '/hr/register'
//         )}
//         <Route path="/about" element={<AboutUs />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="*" element={<Error />} />
//       </Route>

//       {/* Routes without navbar (User routes) */}
//       <Route element={<UserLayout />}>
//         {UserRoutes}
//       </Route>
//     </>
//   )
// );

// export default router;

//   // const router = createBrowserRouter(
//   //   createRoutesFromElements(
//   //     <>
//   //     <Route path="/login" element={<LoginSignup initialAction="Login" />} />
//   //     <Route
//   //       path="/create"
//   //       element={
//   //         <Suspense fallback={<div>Loading...</div>}>
//   //           <LoginSignup initialAction="Sign Up" />
//   //         </Suspense>
//   //       }
//   //     />
   
//   //     <Route path="/" element={<RootLayout />}>
//   //       <Route
//   //         index
//   //         element={
//   //           <ProtectedRoute>
//   //             <Suspense fallback={<div>Loading...</div>}>
//   //               <Home />
//   //             </Suspense>
//   //           </ProtectedRoute>
//   //         }
//   //       />
//   //       <Route
//   //         path="about"
//   //         element={
//   //           <ProtectedRoute>
//   //             <Suspense fallback={<div>Loading...</div>}>
//   //               <About />
//   //             </Suspense>
//   //           </ProtectedRoute>
//   //         }
//   //       />
//   //       <Route
//   //         path="contact"
//   //         element={
//   //           <ProtectedRoute>
//   //             <Suspense fallback={<div>Loading...</div>}>
//   //               <Contact />
//   //             </Suspense>
//   //           </ProtectedRoute>
//   //         }
//   //       />
//   //       <Route
//   //         path="jobs/new"
//   //         element={
//   //           <ProtectedRoute>
//   //             <Suspense fallback={<div>Loading...</div>}>
//   //               <CreateJob />
//   //             </Suspense>
//   //           </ProtectedRoute>
//   //         }
//   //       />
//   //       <Route
//   //         path="jobs/:id"
//   //         element={
//   //           <ProtectedRoute>
//   //             <Suspense fallback={<div>Loading...</div>}>
//   //               <JobDetails />
//   //             </Suspense>
//   //           </ProtectedRoute>
//   //         }
//   //       />
//   //       <Route
//   //         path="profile"
//   //         element={
//   //           <ProtectedRoute>
//   //             <Suspense fallback={<div>Loading...</div>}>
//   //               <YourProfile />
//   //             </Suspense>
//   //           </ProtectedRoute>
//   //         }
//   //       />
//   //       <Route
//   //         path="*"
//   //         element={
//   //           <Suspense fallback={<div>Loading...</div>}>
//   //             <Error />
//   //           </Suspense>
//   //         }
//   //       />
//   //     </Route>

//   //     </>
//   //   )
//   // );
  
//   // export default router;