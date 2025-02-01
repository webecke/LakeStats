import { Outlet } from 'react-router-dom';
import './AdminLayout.css';

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <header className="admin-header">
                <h1>LakeStats Admin Panel</h1>
                <nav>
                    {/* Add your admin navigation */}
                </nav>
            </header>
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}
