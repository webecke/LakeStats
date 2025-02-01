import {Outlet} from 'react-router-dom';
import Footer from "./Footer.tsx";

export default function PublicLayout() {
    return (
        <div>
            {/* Add your header, nav, etc. */}
            <main>
                <Outlet />
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    );
}
