import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { HrProtectedRoute } from '../../components/ProtectedRoute';
import CreateJob from '../pages/CreateJob';
import Home from '../pages/Homepage'
import JobDetails from '../pages/JobDetails';
import LoginSignup from '../pages/LoginSignup';
import YourProfile from '../pages/YourProfile';
import ApplicantsPage from '../pages/Applicants';
import PassedApplicantsPage from '../pages/PassedApplicants';

const HrRoutes = (
  <>
    <Route path="login" element={<Suspense fallback={<div>Loading...</div>}><LoginSignup initialAction="Login" /></Suspense>} />
    <Route path="create" element={<Suspense fallback={<div>Loading...</div>}><LoginSignup initialAction="Sign Up" /></Suspense>} />
    <Route path="" element={<HrProtectedRoute><Suspense fallback={<div>Loading...</div>}><Home /></Suspense></HrProtectedRoute>} />
    <Route path="jobs/new" element={<HrProtectedRoute><Suspense fallback={<div>Loading...</div>}><CreateJob /></Suspense></HrProtectedRoute>} />
    <Route path="jobs/:id" element={<HrProtectedRoute><Suspense fallback={<div>Loading...</div>}><JobDetails /></Suspense></HrProtectedRoute>} />
    <Route path="jobs/:id/applicants" element={<HrProtectedRoute><Suspense fallback={<div>Loading...</div>}><ApplicantsPage /></Suspense></HrProtectedRoute>} />
    <Route path="jobs/:id/passed-applicants" element={<HrProtectedRoute><Suspense fallback={<div>Loading...</div>}><PassedApplicantsPage /></Suspense></HrProtectedRoute>} />
    <Route path="profile" element={<HrProtectedRoute><Suspense fallback={<div>Loading...</div>}><YourProfile /></Suspense></HrProtectedRoute>} />
  </>
);

export default HrRoutes;