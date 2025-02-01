import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PublicLayout from './components/public/layout/PublicLayout';
import LoadingSpinner from './components/shared/LoadingSpinner';

const AdminLayout = lazy(() => import('./components/admin/layout/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const LakeManager = lazy(() => import('./pages/admin/LakeManager'));

// Public routes load normally
import Home from './pages/public/Home';
import LakeView from './pages/public/LakeView';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: ':lakeId',
                element: <LakeView />
            }
        ]
    },
    {
        path: '/admin',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <AdminLayout />
            </Suspense>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <AdminDashboard />
                        <LoadingSpinner />
                    </Suspense>
                )
            },
            {
                path: 'lakes',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <LakeManager />
                    </Suspense>
                )
            }
        ]
    }
]);
