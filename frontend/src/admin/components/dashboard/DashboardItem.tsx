import "./LakeManagerPreview.css";
interface DashboardItemProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export default function DashboardItem({ children, title, description }: DashboardItemProps) {
    return (
        <div className="dashboard-item">
            {title && <h2 className="dashboard-item-title">{title}</h2>}
            {description && <p className="dashboard-item-description">{description}</p>}
            <hr />
            {children}
        </div>
    );
}
