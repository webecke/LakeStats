import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes.tsx";
import { NotificationProvider } from "./shared/components/Notification/NotificationContext.tsx";
import { PWAProvider } from "./pwa/PWAContext";
import OfflineBanner from "./pwa/OfflineBanner";

function App() {
    return (
        <NotificationProvider>
            <PWAProvider>
                <OfflineBanner />
                <RouterProvider router={router} />
            </PWAProvider>
        </NotificationProvider>
    );
}

export default App;
