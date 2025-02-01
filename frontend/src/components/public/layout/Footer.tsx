import { Link } from "react-router-dom";
import webeckeLogo from '../../../assets/webeckedev.svg';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <Link to={"https://webecke.dev"} className="footer-logo">
                    <img src={webeckeLogo} alt="Webecke.dev" />
                </Link>
                <div className="footer-content">
                    <p>© 2025 Dallin Webecke</p>
                    <p>
                        <a href="https://github.com/webecke/LakeStats" target="_blank">View on Github</a>
                        {" | "}
                        Latest build: <em>February 1 2025 16:30</em>
                    </p>
                    <p>
                        <Link to="/privacy">Privacy Notice</Link>
                        {" | "}
                        <Link to="/terms">Terms of Service</Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
