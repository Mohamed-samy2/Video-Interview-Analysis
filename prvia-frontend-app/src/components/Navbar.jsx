// src/components/Navbar.jsx
import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser } from 'react-icons/fa'; 
import { toast } from 'react-toastify'; 

const CustomNavbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false); // Update AuthContext
    localStorage.removeItem('user'); // Clear user data
    toast.success('Logged out successfully!'); // Show success toast
    navigate('/login'); // Redirect to login
  };

  return (
    <Navbar bg="light" expand="lg" className="custom-navbar">
      <Navbar.Brand as={Link} to="/">Prvia</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/about">About</Nav.Link>
          <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
        </Nav>
        <Nav>
          {isLoggedIn ? (
            <NavDropdown title={<span><FaUser className="me-1" /> Your Profile</span>} id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/profile">View Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;



// // src/components/Navbar.jsx
// import React from 'react';
// import { FaUser } from 'react-icons/fa'; 
// import { toast } from 'react-toastify';
// import { useAuth } from '../context/AuthContext';
// import { Link } from 'react-router-dom';
// import { Navbar as BootstrapNavbar, Nav, NavDropdown } from 'react-bootstrap';

// function Navbar()  {
//   const { isLoggedIn } = useAuth();
  
//   return (
//     <BootstrapNavbar bg="light" variant="light" expand="lg" className="custom-navbar">
//        <img src="/logo.png" alt="Logo" className="custom-logo" />
//       <BootstrapNavbar.Brand as={Link} to="/"> PRVIA </BootstrapNavbar.Brand>
//       <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
//       <BootstrapNavbar.Collapse id="basic-navbar-nav">
//         <Nav className="mx-auto">
//           <Nav.Link as={Link} to="/">Home</Nav.Link>
//           <Nav.Link as={Link} to="/about">About</Nav.Link>
//           <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
//         </Nav>
//         <Nav>
//           {isLoggedIn ? (
//             <NavDropdown title="Your Profile" id="profile-dropdown">
//               <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
//               <NavDropdown.Item onClick={() => console.log('Logout')}>
//                 Logout
//               </NavDropdown.Item>
//             </NavDropdown>
//           ) : (
//             <>
//               <Nav.Link as={Link} to="/login">Login</Nav.Link>
//               <Nav.Link as={Link} to="/register">Register</Nav.Link>
//             </>
//           )}
//         </Nav>
//       </BootstrapNavbar.Collapse>
//     </BootstrapNavbar>
//   );
// }

// export default Navbar;