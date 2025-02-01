import { Link } from "react-router-dom";
import webeckeLogo from '../../../assets/webeckedev.svg';
import './Footer.css';
import {BUILD_TIME} from "../../../buildInfo.ts";

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
                        Latest build: <em>{BUILD_TIME}</em>
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
