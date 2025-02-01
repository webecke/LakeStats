import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            {/* Add your admin navigation */}
            <main>
                <Outlet />
            </main>
        </div>
    );
}
