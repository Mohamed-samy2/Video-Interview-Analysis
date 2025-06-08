import { Navbar } from 'react-bootstrap';
import logo from '../assets/ChatGPT_Image_May_9__2025__06_18_02_PM-removebg-preview.png';
import '../styles/NavbarStyles.css';

const Header = () => {
  return (
    <Navbar className="custom-header">
      <Navbar.Brand href="#home" >
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
    </Navbar>
  );
};

export default Header;