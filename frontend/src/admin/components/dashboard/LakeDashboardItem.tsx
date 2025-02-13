import { LakeSystemSettings } from "../../../shared/services/data";
import { Button } from "../../../shared/components/Button";
import { Settings, ChevronUp, ChevronDown } from "lucide-react";
import "./LakeDashboardItem.css";

interface LakePreviewProps {
    lake: LakeSystemSettings;
    onMoveUp?: (lake: LakeSystemSettings) => void;
    onMoveDown?: (lake: LakeSystemSettings) => void;
    isFirst?: boolean;
    isLast?: boolean;
}

export default function LakeDashboardItem({
      lake,
      onMoveUp,
      onMoveDown,
      isFirst = false,
      isLast = false
  }: LakePreviewProps) {
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
                    <div className="lake-preview__order-actions">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMoveUp?.(lake)}
                            disabled={isFirst}
                        >
                            <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMoveDown?.(lake)}
                            disabled={isLast}
                        >
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </div>
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
