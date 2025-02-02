import {useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';
import {authService, User} from '../../../services/auth';
import {Button} from '../../ui/Button';
import {LoginForm} from "../login/LoginForm.tsx";
import LoadingSpinner from "../../shared/LoadingSpinner.tsx";

export default function AdminLayout() {
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
                    onClick={() => authService.signOut()}
                >
                    Sign Out
                </Button>
            </div>
            <Outlet />
        </div>
    );
}
