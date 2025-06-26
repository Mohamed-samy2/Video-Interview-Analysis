import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/NavbarStyles.css';
import './styles/LoginSignup.css';
import './styles/JobDetails.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);