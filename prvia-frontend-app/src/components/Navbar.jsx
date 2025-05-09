// src/components/Navbar.jsx
import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser } from 'react-icons/fa';
// import { toast } from 'react-toastify';
import logo from '../assets/ChatGPT_Image_May_9__2025__06_18_02_PM-removebg-preview.png';




const CustomNavbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/hr/login');
  };


  return (
    <Navbar bg="light" expand="lg" className="custom-navbar">
    <Navbar.Brand as={Link} to="/hr" className="d-flex align-items-center">
  <img
    src={logo}
    alt="Prvia Logo"
    style={{
      height: '90px',
      width: 'auto',
      marginRight: '10px',
      objectFit: 'contain',
    }}
  />
</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/hr">Home</Nav.Link>
          <Nav.Link as={Link} to="/hr/about">About</Nav.Link>
          <Nav.Link as={Link} to="/hr/contact">Contact Us</Nav.Link>
        </Nav>
        <Nav>
          {isLoggedIn ? (
            <NavDropdown title={<span><FaUser className="me-1" /> Your Profile</span>} id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/hr/profile">View Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <Nav.Link as={Link} to="/hr/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/hr/create">Register</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};


export default CustomNavbar;
