import {createBrowserRouter, Navigate} from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PublicLayout from './public/components/layout/PublicLayout';
import LoadingSpinner from './shared/components/LoadingSpinner.tsx';

const AdminLayout = lazy(() => import('./admin/components/layout/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/pages/Dashboard.tsx'));
const LakeManager = lazy(() => import('./admin/pages/LakeManager.tsx'));
const StaticLayout = lazy(() => import('./public/ui/static/StaticLayout.tsx'));
const Terms = lazy(() => import('./public/ui/static/Terms.tsx'));

// load these components everytime
import Home from './public/ui/Home.tsx';
import LakeViewPage from './public/ui/lakeview/LakeViewPage.tsx';
import NotFound from "./public/ui/static/NotFound.tsx";

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
                path: '/404',
                element: <NotFound />
            },
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
    },
    // Fallback route for any unmatched paths
    {
        path: '*',
        element: <Navigate to="/404" replace />
    }
]);

export const handleNotFoundRedirect = (
    sourcePath: string,
    navigateFunction: (path: string) => void
) => {
    // Sanitize the URL by removing consecutive slashes
    const sanitizeUrl = (url: string): string => {
        // Handle protocol separately
        if (url.includes('://')) {
            const [protocol, rest] = url.split('://');
            return `${protocol}://${rest.replace(/\/+/g, '/')}`;
        }

        // For paths without protocol, simply replace consecutive slashes
        return url.replace(/\/+/g, '/');
    };

    const sanitizedPath = sanitizeUrl(sourcePath);
    navigateFunction(`/404?source=${encodeURIComponent(sanitizedPath)}`);
};
