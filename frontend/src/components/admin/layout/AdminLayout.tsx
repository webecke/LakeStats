import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { authService, User } from '../../../services/auth';
import { Button } from '../../ui/Button';

export default function AdminLayout() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set up auth state listener
        const unsubscribe = authService.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return unsubscribe;
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Or your LoadingSpinner component
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl mb-4">Admin Access Required</h1>
                <Button onClick={() => authService.signIn()}>Sign In</Button>
            </div>
        );
    }

    return (
        <div>
            <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <span>Welcome, {user.email}</span>
                <button
                    onClick={() => authService.signOut()}
                    className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
                >
                    Sign Out
                </button>
            </div>
            <Outlet />
        </div>
    );
}
