import React, { createContext, useContext, useReducer, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { NotificationContainer } from "./NotificationContainer.tsx";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    duration?: number;
}

interface NotificationContextType {
    notifications: Notification[];
    showNotification: (message: string, type: NotificationType, duration?: number) => void;
    hideNotification: (id: string) => void;
}

// Action types
type NotificationAction =
    | { type: "SHOW_NOTIFICATION"; payload: Notification }
    | { type: "HIDE_NOTIFICATION"; payload: string };

// Reducer
function notificationReducer(state: Notification[], action: NotificationAction): Notification[] {
    switch (action.type) {
        case "SHOW_NOTIFICATION":
            return [...state, action.payload];
        case "HIDE_NOTIFICATION":
            return state.filter((notification) => notification.id !== action.payload);
        default:
            return state;
    }
}

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, dispatch] = useReducer(notificationReducer, []);

    const hideNotification = useCallback((id: string) => {
        dispatch({
            type: "HIDE_NOTIFICATION",
            payload: id,
        });
    }, []);

    const showNotification = useCallback(
        (message: string, type: NotificationType, duration = 6000) => {
            const id = uuidv4();
            dispatch({
                type: "SHOW_NOTIFICATION",
                payload: { id, message, type, duration },
            });

            // Auto-dismiss
            setTimeout(() => {
                hideNotification(id);
            }, duration);
        },
        [hideNotification]
    );

    return (
        <NotificationContext.Provider value={{ notifications, showNotification, hideNotification }}>
            {children}
            <NotificationContainer />
        </NotificationContext.Provider>
    );
}

// Hook for using notifications
export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}
