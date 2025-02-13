import {useEffect, useState} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {authService, User} from '../../../shared/services/auth';
import {Button} from '../../../shared/components/Button';
import {LoginForm} from "../login/LoginForm.tsx";
import LoadingSpinner from "../../../shared/components/LoadingSpinner.tsx";

export default function AdminLayout() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return authService.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return (
            <>
                <div className="admin-auth-container">
                    <LoginForm />
                </div>
            </>
        );
    }

    return (
        <div>
            <div className="admin-header">
                <h1>LakeStats Admin Panel</h1>
                <Button
                    variant="outline"
                    onClick={() => navigate("/admin")} >
                    Dashboard
                </Button>
                <Button
                    variant="outline"
                    onClick={() => authService.signOut()}
                >
                    Sign Out
                </Button>
            </div>
            <Outlet />
        </div>
    );
}
