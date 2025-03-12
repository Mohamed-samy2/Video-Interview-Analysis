// import { BrowserRouter , Routes, Route } from "react-router-dom";
import {createBrowserRouter,createRoutesFromElements,BrowserRouter,Routes,RouterProvider,Route, Outlet} from "react-router-dom";
import Home from "../pages/Homepage";
import Navbar from "../components/Navbar";
import Error from "../pages/Error";

const AppRoutes = () => {
    return (
    <BrowserRouter>
         <Navbar /> 
         <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error />} />
 
        </Routes>
    </BrowserRouter>
    )

}
export default AppRoutes;

// const router = createBrowserRouter(
//     createRoutesFromElements(
//       <Route path="/" element={<RootLayout />}>
//         {/* Use index route for the default landing page */}
//         <Route index element={<Home />} />
//         <Route path="about" element={<About />} />
//         <Route path="contact" element={<Contact />} />
//         <Route path="cart" element={<CartPageWrapper />} />
//         <Route path="login" element={<Login />} />
//         <Route path="*" element={<Error />} />
//         <Route path="post/:id/" element={<Post />} />
//         <Route path="dashboard" 
//         element={ 
//           <ProtectedRoute user={user}>
//               <DashboardLayout />
//           </ProtectedRoute>
//          }
//          >
//         <Route index element={<Dashboard />} />
//           <Route path="users" element={<Users />} />
//           <Route path="posts" element={<Posts />} />
//           </Route>
//       </Route>
//     )
//    );