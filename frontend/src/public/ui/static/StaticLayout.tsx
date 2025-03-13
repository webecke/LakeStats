import {Link, Outlet} from "react-router-dom";
import Footer from "../../components/layout/Footer.tsx";
import logoSvg from "../../../assets/LakeStatsLogo-NoBackground.svg";

export default function StaticLayout() {
    return (
        <div className="static-layout">
            <Link to={"/"}>
                <header className="home-header">
                    <div className="home-title-container">
                        <img src={logoSvg} alt="LakeStats Logo" className="home-logo" />
                        <h1 className="home-title">LakeStats</h1>
                    </div>
                </header>
            </Link>
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
