// src/user/routes/UserRoutes.jsx
import  { Suspense } from 'react';
import { Route } from 'react-router-dom';
import UserHome from '../pages/UserHomePage'; 
import JobDetails  from '../../pages/JobDetails'
import ApplicationForm from '../pages/ApplicationForm';
import Question1 from '../pages/Question1';
import Question2 from '../pages/Question2';
import Question3 from '../pages/Question3';
import ThankYou from '../pages/ThankYou';

const UserRoutes = (
  <>
    <Route
      path="/"
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <UserHome /> {/* Changed from Home to UserHome */}
        </Suspense>
      }
    />
    <Route
      path="/job/:id"
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <JobDetails isHr={false} />
        </Suspense>
      }
    />
    <Route
      path="/apply"
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <ApplicationForm />
        </Suspense>
      }
    />
    <Route
      path="/question/1"
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <Question1 />
        </Suspense>
      }
    />
    <Route
      path="/question/2"
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <Question2 />
        </Suspense>
      }
    />
    <Route
      path="/question/3"
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <Question3 />
        </Suspense>
      }
    />
    <Route
      path="/thank-you"
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <ThankYou />
        </Suspense>
      }
    />
  </>
);

export default UserRoutes;


// import React, { Suspense } from 'react';
// import { Route } from 'react-router-dom';
// // import { useAuth } from '../../context/AuthContext';
// // import { useEffect } from 'react';
// import Home from '../pages/UserHomePage';
// import JobDetails from '../pages/JobDetails';
// import ApplicationForm from '../pages/ApplicationForm';
// import Question1 from '../pages/Question1';
// import Question2 from '../pages/Question2';
// import Question3 from '../pages/Question3';
// import ThankYou from '../pages/ThankYou';

// // // Wrapper component to set userId and jobId from URL parameters
// // const ApplyWrapper = ({ children }) => {
// //   const { setUserId } = useAuth();
// //   const [searchParams] = useSearchParams();

// //   useEffect(() => {
// //     const userId = searchParams.get('userId');
// //     localStorage.setItem('userId', userId); // Add this line
// //     const jobId = searchParams.get('jobId');
// //     if (userId) {
// //       setUserId(userId);
// //       localStorage.setItem('jobId', jobId || '');
// //     }
// //   }, [searchParams, setUserId]);

// //   return children;
// // };


// const UserRoutes = (
//   <>
//     <Route
//       path="/"
//       element={
//         <Suspense fallback={<div>Loading...</div>}>
//           <Home />
//         </Suspense>
//       }
//     />
//     <Route
//       path="/job/:id"
//       element={
//         <Suspense fallback={<div>Loading...</div>}>
//           <JobDetails />
//         </Suspense>
//       }
//     />
//     <Route
//       path="/apply"
//       element={
//         <Suspense fallback={<div>Loading...</div>}>
//           <ApplicationForm />
//         </Suspense>
//       }
//     />
//     <Route
//       path="/question/1"
//       element={
//         <Suspense fallback={<div>Loading...</div>}>
//           <Question1 />
//         </Suspense>
//       }
//     />
//     <Route
//       path="/question/2"
//       element={
//         <Suspense fallback={<div>Loading...</div>}>
//           <Question2 />
//         </Suspense>
//       }
//     />
//     <Route
//       path="/question/3"
//       element={
//         <Suspense fallback={<div>Loading...</div>}>
//           <Question3 />
//         </Suspense>
//       }
//     />
//     <Route
//       path="/thank-you"
//       element={
//         <Suspense fallback={<div>Loading...</div>}>
//           <ThankYou />
//         </Suspense>
//       }
//     />
//   </>
// );

// export default UserRoutes;

// src/user/routes/UserRoutes.jsx
// import React, { Suspense } from 'react';
// import { Route } from 'react-router-dom';
// import Home from '../pages/UserHomePage';
// import JobDetails from '../pages/JobDetails';
// import ApplicationForm from '../pages/ApplicationForm';
// import Question1 from '../pages/Question1';
// import Question2 from '../pages/Question2';
// import Question3 from '../pages/Question3';
// import ThankYou from '../pages/ThankYou';

// const UserRoutes = (
//   <>
//     <Route
//       path="/"
//       element={
//         <Suspense fallback={<div>Loading...</div>}>
//           <Home />
//         </Suspense>
//       }
//     />
//     <Route
//       path="/job/:id"
//       element={
//         <Suspense fallback={<div>Loading...</div>}>
//           <JobDetails isHr={false} />
//         </Suspense>
//       }
//     />
//     <Route
//       path="/apply"
//       element={
//         <Suspense fallback={<div>Loading...</div>}>
//           <ApplicationForm />
//         </Suspense>
//       }
//     />
//     <Route
//       path="/question/1"
//       element={
//         <Suspense fallback={<div>Loading...</div>}>
//           <Question1 />
//         </Suspense>
//       }
//     />
//     <Route
//       path="/question/2"
//       element={
//         <Suspense fallback={<div>Loading...</div>}>
//           <Question2 />
//         </Suspense>
//       }
//     />
//     <Route
//       path="/question/3"
//       element={
//         <Suspense fallback={<div>Loading...</div>}>
//           <Question3 />
//         </Suspense>
//       }
//     />
//     <Route
//       path="/thank-you"
//       element={
//         <Suspense fallback={<div>Loading...</div>}>
//           <ThankYou />
//         </Suspense>
//       }
//     />
//   </>
// );

// export default UserRoutes;

// src/user/routes/UserRoutes.jsx
