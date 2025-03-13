import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PublicLayout from './public/components/layout/PublicLayout';
import LoadingSpinner from './shared/components/LoadingSpinner.tsx';

const AdminLayout = lazy(() => import('./admin/components/layout/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/pages/Dashboard.tsx'));
const LakeManager = lazy(() => import('./admin/pages/LakeManager.tsx'));

// Public routes load normally
import Home from './public/ui/Home.tsx';
import LakeViewPage from './public/ui/lakeview/LakeViewPage.tsx';
import StaticLayout from "./public/ui/static/StaticLayout.tsx";
import Terms from "./public/ui/static/Terms.tsx";

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
                element: <LakeViewPage />
            }
        ]
    },
    {
        path: '/',
        element: <StaticLayout />,
        children: [
            {
                path: '/terms',
                element: <Terms />
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
                    </Suspense>
                )
            },
            {
                path: ':lakeId',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <LakeManager />
                    </Suspense>
                )
            }
        ]
    }
]);
