import './DataSources.css';
import { DataType } from '../../../services/data';

interface DataSourcesProps {
    sources: Map<DataType, string>;
    onChange: (sources: Map<DataType, string>) => void;
}

interface DataSourceItem {
    type: DataType;
    url: string;
}

export default function DataSources({ sources, onChange }: DataSourcesProps) {
    const handleAddSource = () => {
        const newSources = new Map(sources);
        // Find first available type
        const availableType = Object.values(DataType).find(type => !sources.has(type));
        if (availableType) {
            newSources.set(availableType, '');
            onChange(newSources);
        }
    };

    const handleRemoveSource = (type: DataType) => {
        const newSources = new Map(sources);
        newSources.delete(type);
        onChange(newSources);
    };

    const handleUrlChange = (type: DataType, url: string) => {
        const newSources = new Map(sources);
        newSources.set(type, url);
        onChange(newSources);
    };

    const handleTypeChange = (oldType: DataType, newType: DataType) => {
        const newSources = new Map(sources);
        const url = newSources.get(oldType) || '';
        newSources.delete(oldType);
        newSources.set(newType, url);
        onChange(newSources);
    };

    // Convert sources map to array for easier rendering
    const sourceItems: DataSourceItem[] = Array.from(sources).map(([type, url]) => ({
        type,
        url
    }));

    // Get available types (not currently in use)
    const getAvailableTypes = (currentType: DataType): DataType[] => {
        return Object.values(DataType).filter(type =>
            type === currentType || !sources.has(type)
        );
    };

    // Format enum value for display
    const formatDataType = (type: string): string => {
        return type.split('_')
            .map(word => word.charAt(0) + word.slice(1).toLowerCase())
            .join(' ');
    };

    return (
        <div className="data-sources">
            <div className="data-sources__list">
                {sourceItems.map(({ type, url }) => (
                    <div key={type} className="data-source-item">
                        <select
                            className="data-source-item__select"
                            value={type}
                            onChange={(e) => handleTypeChange(type, e.target.value as DataType)}
                        >
                            {getAvailableTypes(type).map(availableType => (
                                <option key={availableType} value={availableType}>
                                    {formatDataType(availableType)}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            className="data-source-item__input"
                            value={url}
                            onChange={(e) => handleUrlChange(type, e.target.value)}
                            placeholder="Enter URL..."
                        />
                        <button
                            className="data-source-item__remove"
                            onClick={() => handleRemoveSource(type)}
                            title="Remove source"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {sourceItems.length < Object.keys(DataType).length && (
                <button
                    className="data-sources__add"
                    onClick={handleAddSource}
                >
                    + Add Data Source
                </button>
            )}
        </div>
    );
}
