// src/components/Footer.jsx
import React from 'react';
import '../styles/FooterStyles.css'; 

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-container">
        <div className="footer-columns">
          <div className="footer-column">
            <h5>PRVIA</h5>
            <ul>
              <li>Platform</li>
              <li>Get a Demo</li>
              {/* <li>Assessment Software</li> */}
              <li>Video Interviewing</li>
            </ul>
          </div>
          <div className="footer-column">
            <h5>RESOURCES</h5>
            <ul>
              <li>For Candidates</li>
              {/* <li>For Hiring Managers</li> */}
              <li>PRVIA Blog</li>
              <li>Tools</li>
            </ul>
          </div>
          <div className="footer-column">
            <h5>WHY PRVIA</h5>
            <ul>
              <li>Services</li>
              {/* <li>Security</li> */}
              <li>Our Science</li>
              {/* <li>Integration Partners</li> */}
              {/* <li>Customer Awards</li> */}
            </ul>
          </div>
          <div className="footer-column">
            <h5>COMPANY</h5>
            <ul>
              {/* <li>Legal Center</li> */}
              <li>About Us</li>
              <li>Careers</li>
              {/* <li>Press & News</li> */}
              <li>Contact Us</li>
              {/* <li>Modern Hire</li> */}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 PRVIA, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
