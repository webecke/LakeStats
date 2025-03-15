import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes.tsx";
import { NotificationProvider } from "./shared/components/Notification/NotificationContext.tsx";

function App() {
    return (
        <NotificationProvider>
            <RouterProvider router={router} />
        </NotificationProvider>
    );
}

export default App;
