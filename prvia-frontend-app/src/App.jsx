// import { useState } from "react";
import { RouterProvider} from "react-router-dom";
import './styles/global.css'; // Make sure this import is present
import router from "./AppRoutes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  
  return (
    <AuthProvider>
      <ErrorBoundary>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <RouterProvider router={router} />
      </ErrorBoundary>
    </AuthProvider>
  );

}

export default App;
