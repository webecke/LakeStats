import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
    return (
        <div>
            {/* Add your header, nav, etc. */}
            <main>
                <Outlet />
            </main>
            {/* Add your footer */}
        </div>
    );
}
