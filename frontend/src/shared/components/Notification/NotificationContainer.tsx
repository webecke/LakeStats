import "./Notification.css";
import { Notification, useNotifications } from "./NotificationContext";

function NotificationItem({ notification }: { notification: Notification }) {
    return (
        <div className={`notification notification--${notification.type}`}>
            {notification.message}
        </div>
    );
}

export function NotificationContainer() {
    const { notifications } = useNotifications();

    return (
        <div className="notification-container">
            {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
            ))}
        </div>
    );
}
