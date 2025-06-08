import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/ChatGPT_Image_May_9__2025__06_18_02_PM-removebg-preview.png';
import '../styles/NavbarStyles.css';

const UserNavbar = () => {
  return (
    <Navbar  className="custom-navbar">
      <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
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
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/about">About</Nav.Link>
          <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default UserNavbar;