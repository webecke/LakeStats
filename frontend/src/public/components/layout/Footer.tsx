import { Link } from "react-router-dom";
import webeckeLogo from "../../../assets/webeckedev.svg";
import "./Footer.css";

export default function Footer() {
    const version = import.meta.env.VITE_VERSION || "dev";

    return (
        <footer className="footer">
            <div className="footer-container">
                <Link to={"https://webecke.dev"} className="footer-logo">
                    <img src={webeckeLogo} alt="Webecke.dev" />
                </Link>
                <div className="footer-content">
                    <p>© 2025 Dallin Webecke</p>
                    <p>
                        <Link to="/terms">Terms of Service</Link>
                        <span style={{ padding: "0 10px" }}>•</span>
                        <a
                            href={`https://github.com/webecke/LakeStats/releases/tag/${version}`}
                            target="_blank"
                        >
                            {version}
                        </a>
                    </p>
                    <p>
                        <Link to={"/feedback"}>Give Feedback</Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
