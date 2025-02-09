import { useState } from "react";
import { Button } from "../../ui/Button";
import "./LakeManagerPreview.css";
import { Plus } from "lucide-react";
import {dataService} from "../../../services/data";
import LakeDashboardItemList from "./LakeDashboardItemList.tsx";

export default function LakeManagerPreview() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        lakeName: '',
        lakeId: '',
        brandedName: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dataService.addNewLake({
            lakeName: formData.lakeName,
            lakeId: formData.lakeId,
            brandedName: formData.brandedName
        })
        console.log('Form submitted:', formData);
        setIsOpen(false);
        setFormData({ lakeName: '', lakeId: '', brandedName: '' }); // Reset form
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    };

    return (
        <div className="preview-container">
            <div className="lake-manager__header">
                <h1 className="lake-manager__title">Lake Manager</h1>
                <Button onClick={() => setIsOpen(true)}>
                    <Plus className="lake-manager__button-icon" />
                    Add Lake
                </Button>
            </div>

            <LakeDashboardItemList />


            {isOpen && (
                <div className="modal-backdrop" onClick={handleBackdropClick}>
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Add New Lake</h2>
                            <button
                                className="modal-close"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close dialog"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-field">
                                <label htmlFor="lakeName">Lake Name</label>
                                <input
                                    id="lakeName"
                                    name="lakeName"
                                    value={formData.lakeName}
                                    onChange={handleChange}
                                    placeholder="e.g., Lake Powell"
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="lakeId">Lake ID</label>
                                <input
                                    id="lakeId"
                                    name="lakeId"
                                    value={formData.lakeId}
                                    onChange={handleChange}
                                    placeholder="e.g., lake-powell"
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="brandedName">Branded Name</label>
                                <input
                                    id="brandedName"
                                    name="brandedName"
                                    value={formData.brandedName}
                                    onChange={handleChange}
                                    placeholder="e.g., PowellStats"
                                    required
                                />
                            </div>
                            <div>
                                <p>This lake will be added with no active features and listed as "DISABLED"</p>
                            </div>
                            <div className="modal-footer">
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsOpen(false)}
                                    type="button"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Add Lake
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
