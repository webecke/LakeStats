import { LakeSystemStatus } from "../../../services/data";
import { Button } from "../../ui/Button";
import { Settings } from "lucide-react";
import "./LakeDashboardItem.css";

interface LakePreviewProps {
    lake: LakeSystemStatus;
}

export default function LakeDashboardItem({ lake }: LakePreviewProps) {
    return (
        <div className="lake-preview">
            <div className="lake-preview__content">
                <div className="lake-preview__main">
                    <h2 className="lake-preview__title">{lake.lakeName}</h2>
                    <div className="lake-preview__metadata">
                        <span className="lake-preview__id">{lake.lakeId}</span>
                        <span className="lake-preview__separator">•</span>
                        <span className="lake-preview__branded">{lake.brandedName}</span>
                    </div>
                    <div className="lake-preview__features">
                        {lake.features.map((feature, index) => (
                            <span key={index} className="lake-preview__feature">
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="lake-preview__actions">
                    <Button
                        variant="ghost"
                        size="sm"
                        href={`/admin/${lake.lakeId}`}
                    >
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
