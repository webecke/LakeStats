import React, { useState } from "react";
import "./LakeDetails.css";
import { LakeMetaData } from "../../../shared/services/data";
import { Button } from "../../../shared/components/Button";
import { validateUsgsSiteNumber } from "./lakeManagerTools.ts";
import { useNotifications } from "../../../shared/components/Notification/NotificationContext.tsx";

interface LakeDetailsProps {
    lake: LakeMetaData;
    setLake: (
        value: ((prevState: LakeMetaData | null) => LakeMetaData | null) | LakeMetaData | null
    ) => void;
}

export default function LakeDetails({ lake, setLake }: LakeDetailsProps) {
    const [isTestingUsgs, setIsTestingUsgs] = useState(false);
    const { showNotification } = useNotifications();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setLake((prev) => {
            if (!prev) return prev;

            if (type === "number") {
                return {
                    ...prev,
                    [name]: parseFloat(value),
                };
            }

            if (type === "date") {
                // The value is already in YYYY-MM-DD format from the input
                return {
                    ...prev,
                    [name]: value,
                };
            }

            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handleTestUsgsSite = async () => {
        setIsTestingUsgs(true);
        const result = await validateUsgsSiteNumber(lake.usgsSiteNumber)
        setIsTestingUsgs(false);

        if (result.isValid) {
            showNotification("Valid USGS Site Number! Site Name:\n" + (result.siteName || ""), 'success');
        } else {
            showNotification("Invalid USGS Site Number", 'error');
        }

        setTimeout(() => {
            setIsTestingUsgs(false);
        }, 1000);
    };

    return (
        <div className="lake-form">
            <div className="lake-form__grid">
                <div className="lake-form__field">
                    <h3>Lake Details</h3>
                    <h6>Details with * are required for non-disabled lakes</h6>
                </div>

                <div className="lake-form__field">
                    <label className="lake-form__label" htmlFor="usgsSiteNumber">
                        USGS Site Number*
                    </label>
                    <div className="lake-form__help-text">
                        The USGS site identifier for real-time water level data
                    </div>
                    <div className="lake-form__input-group">
                        <input
                            className="lake-form__input lake-form__input--with-button"
                            id="usgsSiteNumber"
                            name="usgsSiteNumber"
                            value={lake.usgsSiteNumber || ''}
                            onChange={handleChange}
                            placeholder="e.g., 09380000"
                        />
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleTestUsgsSite}
                            isLoading={isTestingUsgs}
                        >
                            Test
                        </Button>
                    </div>
                </div>

                <div className="lake-form__elevation-grid">
                    <div className="lake-form__field">
                        <label className="lake-form__label" htmlFor="fullPoolElevation">
                            Full Pool Elevation*
                        </label>
                        <input
                            className="lake-form__input"
                            type="number"
                            id="fullPoolElevation"
                            name="fullPoolElevation"
                            value={lake.fullPoolElevation}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="lake-form__field">
                        <label className="lake-form__label" htmlFor="minPowerPoolElevation">
                            Min Power Pool*
                        </label>
                        <input
                            className="lake-form__input"
                            type="number"
                            id="minPowerPoolElevation"
                            name="minPowerPoolElevation"
                            value={lake.minPowerPoolElevation}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="lake-form__field">
                        <label className="lake-form__label" htmlFor="deadPoolElevation">
                            Dead Pool*
                        </label>
                        <input
                            className="lake-form__input"
                            type="number"
                            id="deadPoolElevation"
                            name="deadPoolElevation"
                            value={lake.deadPoolElevation}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="lake-form__field">
                    <label className="lake-form__label" htmlFor="googleMapsLinkToDam">
                        Google Maps Link
                    </label>
                    <input
                        className="lake-form__input"
                        id="googleMapsLinkToDam"
                        name="googleMapsLinkToDam"
                        value={lake.googleMapsLinkToDam}
                        onChange={handleChange}
                    />
                </div>

                <div className="lake-form__field">
                    <label className="lake-form__label" htmlFor="description">
                        Description
                    </label>
                    <input
                        className="lake-form__input"
                        id="description"
                        name="description"
                        value={lake.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="lake-form__field">
                    <label className="lake-form__label" htmlFor="fillDate">
                        Fill Date
                    </label>
                    <input
                        className="lake-form__input"
                        type="date"
                        id="fillDate"
                        name="fillDate"
                        value={lake.fillDate}
                        onChange={handleChange}
                    />
                </div>

            </div>
        </div>
    );
}
