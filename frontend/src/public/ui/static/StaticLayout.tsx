import { Link, Outlet, useNavigate, useLocation, ScrollRestoration } from "react-router-dom";
import Footer from "../../components/layout/Footer.tsx";
import logoSvg from "../../../assets/LakeStatsLogo-NoBackground.svg";
import { ArrowLeft } from "lucide-react";
import "./static.css";

export default function StaticLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const canGoBack = location.key !== "default";

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className="static-layout">
            <ScrollRestoration />

            <div className="static-header-container">
                <Link to={"/"}>
                    <header className="home-header">
                        <div className="home-title-container">
                            <img src={logoSvg} alt="LakeStats Logo" className="home-logo" />
                            <h1 className="home-title">LakeStats</h1>
                        </div>
                        {canGoBack && (
                            <button
                                onClick={handleBackClick}
                                className="back-button"
                                aria-label="Go back"
                                style={{ margin: "auto" }}
                            >
                                <ArrowLeft size={20} />
                                <span>Go Back</span>
                            </button>
                        )}
                    </header>
                </Link>
            </div>
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
