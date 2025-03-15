import { Outlet } from "react-router-dom";
import Footer from "./Footer.tsx";
//import './PublicLayout.css';

export default function PublicLayout() {
    return (
        <div className="public-layout">
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
